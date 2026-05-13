import React from 'react';
import { StripeProvider as NativeStripeProvider } from '@stripe/stripe-react-native';
import { stripe as stripeConfig } from '../../config/payments';

export default function StripeProvider({ children }) {
  return (
    <NativeStripeProvider
      publishableKey={stripeConfig.publishableKey}
      merchantIdentifier={stripeConfig.merchantId}
    >
      {children}
    </NativeStripeProvider>
  );
}
