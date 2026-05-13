import { Platform } from 'react-native';
import { stripe as stripeConfig } from '../../config/payments';

// Web-only: lazy-load Stripe.js. The promise is cached so multiple checkout
// attempts reuse the same Stripe instance.
let _stripeJsPromise = null;
export function getStripeJs() {
  if (Platform.OS !== 'web') {
    throw new Error('getStripeJs() is web-only');
  }
  if (_stripeJsPromise) return _stripeJsPromise;
  _stripeJsPromise = import('@stripe/stripe-js').then(({ loadStripe }) =>
    loadStripe(stripeConfig.publishableKey),
  );
  return _stripeJsPromise;
}
