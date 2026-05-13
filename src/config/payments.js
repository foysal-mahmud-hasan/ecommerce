// Payment gateway configuration.
//
// DEMO_ONLY: this app has no backend. Real production payment processing
// REQUIRES a server (PaymentIntent for Stripe, session init + IPN for
// SSLCommerz). The values here are sandbox-only — never swap in production
// credentials without first adding a server.

export const DEMO_ONLY = true;

export const sslcommerz = {
  storeId: 'abc6a02b565bfa76',
  storePassword: 'abc6a02b565bfa76@ssl',
  initUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
  // Redirect targets passed to SSLCommerz. After payment, SSLCommerz
  // redirects the in-app WebBrowser to one of these URLs. They must return
  // 200 — sandbox.sslcommerz.com/example/* no longer exists (404). On native
  // we don't have a server to intercept, so we land on a public 200 page and
  // the user manually dismisses the WebBrowser; the app then routes to
  // /payment-result which shows the manual confirm screen. On web the
  // sslcommerz.js layer overrides these with localhost callbacks at
  // session-init time so the redirect comes back into the SPA automatically.
  successUrl: 'https://www.sslcommerz.com/?status=success',
  failUrl: 'https://www.sslcommerz.com/?status=failed',
  cancelUrl: 'https://www.sslcommerz.com/?status=cancelled',
};

export const stripe = {
  publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
  merchantId: 'merchant.com.fragouras.demo',
};

// Currency → supported gateways. COD is always available. In sandbox/demo
// mode we expose every gateway regardless of currency so you can test all
// flows end-to-end; production should re-tighten this to only show gateways
// that actually support the order currency (e.g. SSLCommerz only for BDT).
export function gatewaysForCurrency(_currencyCode) {
  if (DEMO_ONLY) return ['cod', 'sslcommerz', 'stripe'];
  const code = String(_currencyCode || '').toUpperCase();
  if (code === 'BDT') return ['cod', 'sslcommerz'];
  return ['cod', 'stripe'];
}
