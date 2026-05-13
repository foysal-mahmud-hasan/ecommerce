// Metro dev-server config. The only customization is a CORS-bypass proxy used
// when running the app in a browser (`expo start --web`).
//
// Why: the live ecommerce backend at https://backend.epharmabd.com does not
// emit Access-Control-Allow-Origin headers, so browsers block fetch() calls
// directly from the dev server origin. Native (iOS/Android) is unaffected.
//
// Strategy: any request to `/api-proxy/<absolute-url-encoded>` on the dev
// server gets forwarded server-side to the target URL. The dev server then
// returns the response with CORS headers, which the browser accepts.
//
// This middleware only runs in dev. For production web deploys, host your own
// CORS-enabled proxy (or add CORS to the backend) and point the client at it.
const { getDefaultConfig } = require('expo/metro-config');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const PROXY_PREFIX = '/api-proxy/';

// SSLCommerz auto-submits a POST form to our success_url after payment.
// Expo's CorsMiddleware crashes on `new URL(...)` when the request is a POST
// from a cross-origin form submit, returning a 500. We intercept the POST
// here (before that broken middleware runs), discard the body, and 303-
// redirect the browser to GET the same URL — which the SPA can render
// normally. All the params we need live in the query string of the URL we
// passed as success_url, so dropping the POST body is fine.
function sslcBounceMiddleware(req, res, next) {
  if (
    req.method === 'POST' &&
    typeof req.url === 'string' &&
    req.url.startsWith('/payment-result')
  ) {
    req.resume();
    req.on('end', () => {
      res.statusCode = 303;
      res.setHeader('Location', req.url);
      res.end();
    });
    req.on('error', () => {
      res.statusCode = 303;
      res.setHeader('Location', req.url);
      res.end();
    });
    return;
  }
  return next();
}

function proxyMiddleware(req, res, next) {
  if (!req.url || !req.url.startsWith(PROXY_PREFIX)) return next();

  let target;
  try {
    const encoded = req.url.slice(PROXY_PREFIX.length);
    target = new URL(decodeURIComponent(encoded));
  } catch {
    res.statusCode = 400;
    res.end('Invalid proxy target');
    return;
  }

  const lib = target.protocol === 'https:' ? https : http;
  // Forward request headers but strip browser-specific ones that confuse the
  // upstream server. Setting a header to undefined throws in node — must delete.
  const fwdHeaders = { ...req.headers, host: target.hostname };
  delete fwdHeaders.origin;
  delete fwdHeaders.referer;
  delete fwdHeaders['sec-fetch-site'];
  delete fwdHeaders['sec-fetch-mode'];
  delete fwdHeaders['sec-fetch-dest'];
  const upstream = lib.request(
    {
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers: fwdHeaders,
    },
    (upstreamRes) => {
      const headers = { ...upstreamRes.headers };
      // Inject CORS so the browser accepts the response.
      headers['access-control-allow-origin'] = '*';
      headers['access-control-allow-methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
      headers['access-control-allow-headers'] = 'Content-Type,Accept,Authorization';
      res.writeHead(upstreamRes.statusCode || 502, headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on('error', (err) => {
    res.statusCode = 502;
    res.setHeader('access-control-allow-origin', '*');
    res.end(`Proxy error: ${err.message}`);
  });

  // Pre-flight handling.
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'access-control-allow-headers': 'Content-Type,Accept,Authorization',
    });
    res.end();
    upstream.destroy();
    return;
  }

  req.pipe(upstream);
}

const config = getDefaultConfig(__dirname);

const originalEnhance = config.server?.enhanceMiddleware;
config.server = {
  ...(config.server || {}),
  enhanceMiddleware: (middleware, server) => {
    const enhanced = originalEnhance ? originalEnhance(middleware, server) : middleware;
    return (req, res, next) =>
      sslcBounceMiddleware(req, res, () =>
        proxyMiddleware(req, res, () => enhanced(req, res, next)),
      );
  },
};

module.exports = config;
