import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../src/store/StoreContext';
import { useTheme } from '../src/theme';

// SSLCommerz return landing.
//
// In a server-backed flow this page would consult the validation API and
// trust the server's verdict. Without a backend we can't truly verify the
// payment, so we land here in `pending_payment` and let the user confirm
// the outcome manually unless SSLCommerz redirected with a status param
// (which we wire up for web — see src/api/payments/sslcommerz.js).

const STATUS_META = {
  pending: {
    icon: '⏳',
    title: 'Did your payment go through?',
    body: "We can't auto-verify SSLCommerz transactions in this demo build. Tell us how it went so we can update your order.",
    tint: '#A38B00',
  },
  paid: {
    icon: '✓',
    title: 'Payment confirmed',
    body: 'Thanks — your order has been recorded as paid. Redirecting to your orders…',
    tint: '#0E7A3D',
  },
  failed: {
    icon: '✕',
    title: 'Payment failed',
    body: 'The gateway reported a problem with this transaction. Your order is on hold.',
    tint: '#C0392B',
  },
  cancelled: {
    icon: '⊘',
    title: 'Payment cancelled',
    body: 'You cancelled the payment. Your order is on hold — try again from your cart.',
    tint: '#7A7A7A',
  },
};

function truncate(s, n = 14) {
  if (!s) return '';
  if (s.length <= n) return s;
  return `${s.slice(0, 6)}…${s.slice(-4)}`;
}

export default function PaymentResultScreen() {
  const t = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setOrderStatus, showToast } = useStore();

  const tranId = params.tran_id || params.transactionId;
  const initialStatus = String(params.status || '').toUpperCase();

  const autoResolved = useMemo(() => {
    if (initialStatus === 'VALID' || initialStatus === 'VALIDATED') return 'paid';
    if (initialStatus === 'FAILED') return 'failed';
    if (initialStatus === 'CANCELLED') return 'cancelled';
    return null;
  }, [initialStatus]);

  const [view, setView] = useState(autoResolved || 'pending');

  useEffect(() => {
    if (!tranId || !autoResolved) return;
    if (autoResolved === 'paid') {
      setOrderStatus(tranId, { status: 'paid' });
      showToast('Payment confirmed');
      setTimeout(() => router.replace('/orders'), 1200);
    } else if (autoResolved === 'failed' || autoResolved === 'cancelled') {
      setOrderStatus(tranId, { status: 'failed' });
      setTimeout(() => router.replace('/orders'), 1500);
    }
  }, [tranId, autoResolved]);

  const confirm = (status) => {
    if (tranId) setOrderStatus(tranId, { status });
    showToast(status === 'paid' ? 'Marked as paid' : 'Marked as failed');
    router.replace('/orders');
  };

  const meta = STATUS_META[view] || STATUS_META.pending;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.bg,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: t.bg,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: t.line,
          padding: 28,
          alignItems: 'center',
          gap: 16,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: meta.tint + '18',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32, color: meta.tint }}>{meta.icon}</Text>
        </View>

        <Text
          style={{
            fontFamily: t.fonts.serif,
            fontSize: 22,
            color: t.ink,
            textAlign: 'center',
          }}
        >
          {meta.title}
        </Text>

        <Text
          style={{
            fontFamily: t.fonts.sans,
            fontSize: 14,
            color: t.ink3,
            textAlign: 'center',
            maxWidth: 360,
            lineHeight: 21,
          }}
        >
          {meta.body}
        </Text>

        {tranId ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: t.surfaceAlt,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontFamily: t.fonts.sansMedium,
                fontSize: 10.5,
                letterSpacing: 0.6,
                color: t.ink3,
                textTransform: 'uppercase',
              }}
            >
              Tx
            </Text>
            <Text
              style={{
                fontFamily: t.fonts.mono || t.fonts.sans,
                fontSize: 12,
                color: t.ink2,
              }}
            >
              {truncate(String(tranId), 18)}
            </Text>
          </View>
        ) : null}

        {view === 'pending' ? (
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, width: '100%' }}>
            <Pressable
              onPress={() => confirm('failed')}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: t.surfaceAlt,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: t.ink, fontFamily: t.fonts.sansMedium, fontSize: 14 }}>
                Payment failed
              </Text>
            </Pressable>
            <Pressable
              onPress={() => confirm('paid')}
              style={{
                flex: 1.4,
                paddingVertical: 14,
                borderRadius: 10,
                backgroundColor: t.terra,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: t.fonts.sansSemiBold, fontSize: 14 }}>
                Yes, mark as paid
              </Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.replace('/orders')}
            style={{
              marginTop: 8,
              paddingVertical: 12,
              paddingHorizontal: 22,
              borderRadius: 10,
              backgroundColor: t.surfaceAlt,
            }}
          >
            <Text style={{ color: t.ink, fontFamily: t.fonts.sansMedium, fontSize: 14 }}>
              View orders
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
