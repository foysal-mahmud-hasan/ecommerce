// Payment router. Checkout calls processPayment(...) once; this file
// dispatches to the right gateway and normalizes the return shape.
//
// Returns: { status: 'paid' | 'pending_payment' | 'failed', transactionId, gateway, message? }
// Throws: never — failures come back via the result shape so the caller has
// a single happy-path branch.

export const PAY_STATUS = {
  PAID: 'paid',
  PENDING: 'pending_payment',
  FAILED: 'failed',
};
