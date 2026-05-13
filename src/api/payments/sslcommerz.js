import { Platform } from 'react-native';
import { sslcommerz } from '../../config/payments';

// SSLCommerz session init. POSTs form-encoded data; the wrapper in client.js
// only does JSON, so we hit fetch directly here.
//
// On web, react-native-web's fetch can't reach SSLCommerz directly because
// the gateway doesn't send CORS headers. We route through the existing
// metro middleware proxy at /api-proxy/<encoded-url> (see metro.config.js).

function rewriteForWeb(url) {
  if (Platform.OS !== 'web') return url;
  if (typeof window !== 'undefined' && url.startsWith(window.location.origin)) return url;
  return `/api-proxy/${encodeURIComponent(url)}`;
}

// Build the success/fail/cancel URLs SSLCommerz will redirect the user to
// after payment. On web we point them back at our own /payment-result
// route with status + tran_id baked into the query string, so the result
// page auto-resolves the order without a manual prompt. On native we use
// the static example URLs from config — expo-web-browser is dismissed
// manually and the app routes to /payment-result on close.
function buildCallbackUrls(tranId) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const base = `${window.location.origin}/payment-result`;
    const tid = encodeURIComponent(tranId);
    return {
      success_url: `${base}?status=VALID&tran_id=${tid}`,
      fail_url: `${base}?status=FAILED&tran_id=${tid}`,
      cancel_url: `${base}?status=CANCELLED&tran_id=${tid}`,
    };
  }
  return {
    success_url: sslcommerz.successUrl,
    fail_url: sslcommerz.failUrl,
    cancel_url: sslcommerz.cancelUrl,
  };
}

export async function initSslcSession({
  tran_id,
  amount,
  currency = 'BDT',
  cus_name,
  cus_phone,
  cus_email = 'demo@fragouras.test',
  cus_add1,
  cus_city = 'Dhaka',
  product_name = 'Order',
}) {
  const cb = buildCallbackUrls(tran_id);
  const body = new URLSearchParams({
    store_id: sslcommerz.storeId,
    store_passwd: sslcommerz.storePassword,
    total_amount: String(amount),
    currency,
    tran_id,
    success_url: cb.success_url,
    fail_url: cb.fail_url,
    cancel_url: cb.cancel_url,
    cus_name: cus_name || 'Demo',
    cus_email,
    cus_phone: cus_phone || '01700000000',
    cus_add1: cus_add1 || 'N/A',
    cus_city,
    cus_country: 'Bangladesh',
    shipping_method: 'NO',
    product_name,
    product_category: 'general',
    product_profile: 'general',
  });

  const res = await fetch(rewriteForWeb(sslcommerz.initUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: body.toString(),
  });

  if (!res.ok) throw new Error(`SSLCommerz init failed (HTTP ${res.status})`);
  const data = await res.json();

  if (data.status !== 'SUCCESS' || !data.GatewayPageURL) {
    throw new Error(data.failedreason || 'SSLCommerz session could not be created');
  }
  return {
    gatewayPageUrl: data.GatewayPageURL,
    sessionKey: data.sessionkey,
  };
}

export function makeSslcTransactionId() {
  return `sslc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
