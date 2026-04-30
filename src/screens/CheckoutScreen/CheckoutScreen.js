import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FragButton from '../../components/FragButton';
import MobileHeader from '../../components/MobileHeader';
import CheckoutForm, { validateAddress } from '../../components/CheckoutForm';
import { placeOrder } from '../../api/orders';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { styles } from './CheckoutScreen.styles';

const STEPS = ['Address', 'Payment'];

export default function CheckoutScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    cart,
    clearCart,
    showToast,
    productsCache,
    currency,
    auth,
    recordOrder,
  } = useStore();
  const productMap = productsCache?.byId || {};
  const total = fragCartTotal(cart, productMap);
  const grand = total;
  const count = fragCartCount(cart);

  const [step, setStep] = useState(0); // 0 address · 1 payment
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: auth?.user?.name || '',
    phone: auth?.phone || '',
    line1: '',
    city: '',
    zip: '',
    payment: 'cod',
  });
  const [errors, setErrors] = useState({});

  const onChange = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  async function next() {
    if (step === 0) {
      const { ok, errors: e } = validateAddress(form);
      setErrors(e);
      if (!ok) return;
      setStep(1);
      return;
    }
    setBusy(true);
    try {
      const items = cart.map((c) => {
        const p = productMap[c.id];
        return {
          productId: c.id,
          name: p?.name || 'Item',
          qty: c.qty,
          price: p?.price || 0,
          unit: c.variant?.unit || p?.unit || '',
          image: p?.image || null,
        };
      });
      const order = await placeOrder({
        items,
        address: { name: form.name, phone: form.phone, line1: form.line1, city: form.city, zip: form.zip },
        payment: form.payment,
        currency,
      });
      recordOrder(order);
      clearCart();
      showToast(`Order placed · ${order.id.toUpperCase()}`);
      setTimeout(() => router.replace('/orders'), 600);
    } catch (e) {
      showToast(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader title="Checkout" onBack={() => router.back()} />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.buyBarHeight + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepper}>
          {STEPS.map((label, i) => {
            const active = i <= step;
            return (
              <View key={label} style={styles.stepCol}>
                <View style={[styles.stepBar, { backgroundColor: active ? t.ink : t.line }]} />
                <Text style={[styles.stepLabel, { color: active ? t.ink : t.ink3 }]}>
                  {String(i + 1).padStart(2, '0')} · {label}
                </Text>
              </View>
            );
          })}
        </View>

        <CheckoutForm step={step} form={form} onChange={onChange} errors={errors} />

        <View style={[styles.summary, { backgroundColor: t.surfaceAlt }]}>
          <Text style={[styles.summaryEyebrow, { color: t.ink3 }]}>
            ORDER · {count} ITEM{count !== 1 ? 'S' : ''}
          </Text>
          {cart.slice(0, 3).map((item, i) => {
            const p = productMap[item.id];
            if (!p) return null;
            return (
              <View key={`${item.id}-${i}`} style={styles.summaryRow}>
                <Text style={[styles.summaryItem, { color: t.ink2 }]} numberOfLines={1}>
                  {p.name} × {item.qty}
                </Text>
                <Text style={[styles.summaryItem, { color: t.ink }]}>
                  {formatPrice(p.price * item.qty, currency)}
                </Text>
              </View>
            );
          })}
          {cart.length > 3 ? (
            <Text style={[styles.summaryMore, { color: t.ink3 }]}>+ {cart.length - 3} more</Text>
          ) : null}
          <View style={[styles.summaryDivider, { backgroundColor: t.line }]} />
          <View style={styles.summaryTotalRow}>
            <Text style={[styles.summaryTotalLabel, { color: t.ink }]}>Total</Text>
            <Text style={[styles.summaryTotalLabel, { color: t.ink }]}>
              {formatPrice(grand, currency)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: t.bg, borderTopColor: t.line, paddingBottom: 12 + insets.bottom },
        ]}
      >
        <FragButton variant="primary" size="lg" full onPress={next} disabled={busy}>
          {busy ? 'Placing…' : step < 1 ? 'Continue' : `Place order · ${formatPrice(grand, currency)}`}
        </FragButton>
      </View>
    </View>
  );
}
