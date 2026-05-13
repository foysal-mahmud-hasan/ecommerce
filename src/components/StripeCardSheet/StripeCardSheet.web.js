import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useTheme } from '../../theme';
import { getStripeJs } from '../../api/payments/stripe';
import { DEMO_ONLY } from '../../config/payments';

// Web Stripe card collection. Demo-only: tokenizes a card via
// stripe.createPaymentMethod and treats success as "paid". A production
// implementation would call a backend /create-payment-intent and then
// stripe.confirmCardPayment with the returned client_secret.

const BRAND_LABEL = {
  visa: 'VISA',
  mastercard: 'Mastercard',
  amex: 'AMEX',
  discover: 'Discover',
  diners: 'Diners',
  jcb: 'JCB',
  unionpay: 'UnionPay',
};

const BRAND_COLOR = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#006FCF',
  discover: '#FF6000',
  diners: '#0079BE',
  jcb: '#0E4C96',
  unionpay: '#E21836',
};

function elementOptions(t) {
  return {
    style: {
      base: {
        fontSize: '15px',
        color: t.ink,
        fontFamily: 'Inter, system-ui, sans-serif',
        '::placeholder': { color: t.ink3 },
      },
      invalid: { color: t.sale },
    },
  };
}

function FieldShell({ label, children, t, flex }) {
  return (
    <View style={{ flex }}>
      <Text
        style={{
          fontFamily: t.fonts.sansMedium,
          fontSize: 11,
          letterSpacing: 0.6,
          color: t.ink3,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: t.surface,
          borderColor: t.line,
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 12,
          minHeight: 44,
          justifyContent: 'center',
        }}
      >
        {children}
      </View>
    </View>
  );
}

function BrandBadge({ brand, t }) {
  const label = BRAND_LABEL[brand];
  if (!label) return null;
  return (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        backgroundColor: BRAND_COLOR[brand] || t.ink,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontFamily: t.fonts.sansSemiBold,
          fontSize: 10,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function CardForm({ onComplete, onCancel, amountLabel, itemsCount }) {
  const t = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [brand, setBrand] = useState('unknown');
  const [done, setDone] = useState({ number: false, expiry: false, cvc: false });

  const allComplete = done.number && done.expiry && done.cvc;
  const canSubmit = stripe && elements && allComplete && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    const cardNumber = elements.getElement(CardNumberElement);
    const { error: err, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardNumber,
    });
    setBusy(false);
    if (err) {
      setError(err.message || 'Card was declined');
      return;
    }
    onComplete({
      transactionId: paymentMethod.id,
      brand: paymentMethod.card?.brand,
      last4: paymentMethod.card?.last4,
    });
  };

  return (
    <View style={{ gap: 16 }}>
      <View style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: t.fonts.serif,
            fontSize: 22,
            color: t.ink,
          }}
        >
          Pay with card
        </Text>
        <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink3 }}>
          Your card information is encrypted by Stripe.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: t.surfaceAlt,
          borderRadius: 12,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink2 }}>
          {itemsCount ? `${itemsCount} item${itemsCount !== 1 ? 's' : ''} · Total` : 'Total'}
        </Text>
        <Text
          style={{
            fontFamily: t.fonts.sansSemiBold,
            fontSize: 18,
            color: t.ink,
          }}
        >
          {amountLabel}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <FieldShell label="Card number" t={t}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <CardNumberElement
                options={{
                  ...elementOptions(t),
                  showIcon: false,
                  placeholder: '1234 1234 1234 1234',
                }}
                onChange={(e) => {
                  setDone((d) => ({ ...d, number: e.complete }));
                  setBrand(e.brand || 'unknown');
                  if (e.error) setError(e.error.message);
                  else setError(null);
                }}
              />
            </View>
            <BrandBadge brand={brand} t={t} />
          </View>
        </FieldShell>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <FieldShell label="Expiry" t={t} flex={1}>
            <CardExpiryElement
              options={{ ...elementOptions(t), placeholder: 'MM / YY' }}
              onChange={(e) => setDone((d) => ({ ...d, expiry: e.complete }))}
            />
          </FieldShell>
          <FieldShell label="CVC" t={t} flex={1}>
            <CardCvcElement
              options={{ ...elementOptions(t), placeholder: 'CVC' }}
              onChange={(e) => setDone((d) => ({ ...d, cvc: e.complete }))}
            />
          </FieldShell>
        </View>
      </View>

      {error ? (
        <Text style={{ color: t.sale, fontSize: 13, fontFamily: t.fonts.sans }}>{error}</Text>
      ) : null}

      {DEMO_ONLY ? (
        <View
          style={{
            backgroundColor: t.surface,
            borderColor: t.line,
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: t.ink3,
              fontSize: 11.5,
              fontFamily: t.fonts.mono || t.fonts.sans,
              lineHeight: 16,
            }}
          >
            Test card 4242 4242 4242 4242 · any future date · any 3-digit CVC
          </Text>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            paddingVertical: 14,
            borderRadius: 10,
            backgroundColor: t.surfaceAlt,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: t.ink, fontFamily: t.fonts.sansMedium, fontSize: 15 }}>
            Cancel
          </Text>
        </Pressable>
        <Pressable
          onPress={submit}
          disabled={!canSubmit}
          style={{
            flex: 2,
            paddingVertical: 14,
            borderRadius: 10,
            backgroundColor: canSubmit ? t.terra : t.ink3,
            alignItems: 'center',
            opacity: canSubmit ? 1 : 0.6,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontFamily: t.fonts.sansSemiBold, fontSize: 15 }}>
            {busy ? 'Processing…' : `Pay ${amountLabel}`}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: 4,
        }}
      >
        <Text style={{ fontSize: 12, color: t.ink3 }}>🔒</Text>
        <Text
          style={{
            color: t.ink3,
            fontSize: 11.5,
            fontFamily: t.fonts.sans,
            letterSpacing: 0.3,
          }}
        >
          Secured by Stripe · PCI-DSS compliant
        </Text>
      </View>
    </View>
  );
}

export default function StripeCardSheet({ open, amountLabel, itemsCount, onComplete, onCancel }) {
  const t = useTheme();
  const [stripePromise, setStripePromise] = useState(null);

  useEffect(() => {
    if (!open) return;
    setStripePromise(getStripeJs());
  }, [open]);

  const overlayPress = useMemo(
    () =>
      Platform.OS === 'web'
        ? { onClick: (e) => e.target === e.currentTarget && onCancel?.() }
        : {},
    [onCancel],
  );

  if (!open) return null;

  return (
    <Modal transparent animationType="fade" visible={open} onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
        {...overlayPress}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 460,
            backgroundColor: t.bg,
            borderRadius: 18,
            padding: 24,
            borderWidth: 1,
            borderColor: t.line,
            shadowColor: '#000',
            shadowOpacity: 0.18,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          {stripePromise ? (
            <Elements stripe={stripePromise}>
              <CardForm
                amountLabel={amountLabel}
                itemsCount={itemsCount}
                onComplete={onComplete}
                onCancel={onCancel}
              />
            </Elements>
          ) : (
            <Text style={{ color: t.ink3, fontFamily: t.fonts.sans }}>Loading Stripe…</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
