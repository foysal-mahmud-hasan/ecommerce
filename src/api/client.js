import { Platform } from 'react-native';

// Single fetch wrapper. Adds timeout/abort + normalized errors so callers
// can branch on error.kind without touching raw fetch internals.
//
// Web CORS bypass: in dev on the web platform, external HTTPS requests are
// rewritten to go through a metro middleware proxy at /api-proxy/<encoded-url>.
// See metro.config.js. Native (iOS/Android) is unaffected.

const DEFAULT_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(kind, status, message, cause) {
    super(message);
    this.kind = kind; // 'network' | 'http' | 'parse' | 'timeout'
    this.status = status;
    this.cause = cause;
  }
}

function rewriteForWeb(url) {
  if (Platform.OS !== 'web' || typeof url !== 'string') return url;
  if (!/^https?:\/\//i.test(url)) return url;
  // Same-origin URLs (already pointing at the dev server) need no rewriting.
  if (typeof window !== 'undefined' && url.startsWith(window.location.origin)) return url;
  return `/api-proxy/${encodeURIComponent(url)}`;
}

export async function request(url, options = {}) {
  const { method = 'GET', body, headers = {}, signal, timeoutMs = DEFAULT_TIMEOUT } = options;

  const finalUrl = rewriteForWeb(url);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Allow callers to cancel via their own signal too.
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort);
  }

  let res;
  try {
    res = await fetch(finalUrl, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    signal?.removeEventListener?.('abort', onCallerAbort);
    if (err.name === 'AbortError') {
      throw new ApiError('timeout', 0, 'Request timed out', err);
    }
    throw new ApiError('network', 0, err.message || 'Network error', err);
  }

  clearTimeout(timeoutId);
  signal?.removeEventListener?.('abort', onCallerAbort);

  if (!res.ok) {
    throw new ApiError('http', res.status, `HTTP ${res.status}`);
  }

  try {
    return await res.json();
  } catch (err) {
    throw new ApiError('parse', res.status, 'Invalid JSON response', err);
  }
}
