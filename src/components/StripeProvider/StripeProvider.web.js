// Web doesn't need the native StripeProvider — Stripe.js is loaded on demand
// from src/api/payments/stripe.js with loadStripe() and the Elements wrapper
// is mounted around the CardElement inside StripeCardSheet.web.js.

export default function StripeProvider({ children }) {
  return children;
}
