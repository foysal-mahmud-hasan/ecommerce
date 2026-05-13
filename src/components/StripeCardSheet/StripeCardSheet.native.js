import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useTheme } from '../../theme';
import { DEMO_ONLY } from '../../config/payments';

// Native Stripe card collection. Demo-only: tokenizes a card via
// createPaymentMethod and treats success as "paid". Production needs a
// backend PaymentIntent + confirmPayment(clientSecret).
//
// IMPORTANT: @stripe/stripe-react-native is a native module — Expo Go cannot
// load it. Use a development build (`npx expo prebuild && npx expo run:ios`).

export default function StripeCardSheet({ open, amountLabel, itemsCount, onComplete, onCancel }) {
  const t = useTheme();
  const { createPaymentMethod } = useStripe();
  const [cardComplete, setCardComplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const canSubmit = cardComplete && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);
    const { error: err, paymentMethod } = await createPaymentMethod({
      paymentMethodType: 'Card',
    });
    setBusy(false);
    if (err) {
      setError(err.message || 'Card was declined');
      return;
    }
    onComplete({
      transactionId: paymentMethod.id,
      brand: paymentMethod.Card?.brand,
      last4: paymentMethod.Card?.last4,
    });
  };

  if (!open) return null;

  return (
    <Modal transparent animationType="slide" visible={open} onRequestClose={onCancel}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: t.bg,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            paddingHorizontal: 22,
            paddingTop: 12,
            paddingBottom: 36,
            gap: 16,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 44,
              height: 4,
              borderRadius: 2,
              backgroundColor: t.line,
              marginBottom: 4,
            }}
          />

          <View style={{ gap: 4 }}>
            <Text style={{ fontFamily: t.fonts.serif, fontSize: 22, color: t.ink }}>
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
              paddingHorizontal: 14,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink2 }}>
              {itemsCount ? `${itemsCount} item${itemsCount !== 1 ? 's' : ''} · Total` : 'Total'}
            </Text>
            <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 18, color: t.ink }}>
              {amountLabel}
            </Text>
          </View>

          <View style={{ gap: 6 }}>
            <Text
              style={{
                fontFamily: t.fonts.sansMedium,
                fontSize: 11,
                letterSpacing: 0.6,
                color: t.ink3,
                textTransform: 'uppercase',
              }}
            >
              Card details
            </Text>
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: '1234 1234 1234 1234' }}
              cardStyle={{
                backgroundColor: t.surface,
                textColor: t.ink,
                placeholderColor: t.ink3,
                borderRadius: 10,
                borderColor: t.line,
                borderWidth: 1,
                fontSize: 15,
              }}
              style={{ width: '100%', height: 52 }}
              onCardChange={(details) => setCardComplete(details.complete)}
            />
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

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
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
              marginTop: 2,
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
      </View>
    </Modal>
  );
}
