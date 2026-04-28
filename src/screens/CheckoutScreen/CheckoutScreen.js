import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FragButton from '../../components/FragButton';
import { IconShield } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import { placeOrder } from '../../api/orders';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { styles } from './CheckoutScreen.styles';

const STEPS = ['Address', 'Payment'];

const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on delivery', sub: 'Pay in cash when your order arrives.' },
  { id: 'bkash', label: 'bKash', sub: "Mobile money — we'll redirect at checkout." },
  { id: 'nagad', label: 'Nagad', sub: "Mobile money — we'll redirect at checkout." },
];

function Field({ label, placeholder, value, onChange, error, t, keyboardType }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldLabelRow}>
        <Text style={[styles.fieldLabel, { color: t.ink3 }]}>{label}</Text>
        {error ? <Text style={[styles.fieldError, { color: t.sale }]}>· {error}</Text> : null}
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={t.ink3}
        keyboardType={keyboardType}
        style={[
          styles.input,
          {
            backgroundColor: t.surface,
            borderColor: error ? t.sale : t.line,
            color: t.ink,
          },
        ]}
      />
    </View>
  );
}

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

  const [step, setStep] = useState(1);
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

  function validate(fields) {
    const e = {};
    fields.forEach((f) => {
      if (!form[f] || String(form[f]).trim().length < 2) e[f] = 'Required';
    });
    if (fields.includes('phone') && form.phone && form.phone.replace(/\D/g, '').length < 7) {
      e.phone = 'Invalid';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function next() {
    if (step === 1 && !validate(['name', 'phone', 'line1', 'city'])) return;
    if (step < 2) {
      setStep(step + 1);
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
            const active = i < step;
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

        {step === 1 && (
          <View>
            <Field label="FULL NAME" placeholder="" value={form.name} onChange={onChange('name')} error={errors.name} t={t} />
            <Field label="MOBILE" placeholder="01XXXXXXXXX" value={form.phone} onChange={onChange('phone')} error={errors.phone} t={t} keyboardType="phone-pad" />
            <Field label="ADDRESS" placeholder="House, road, area" value={form.line1} onChange={onChange('line1')} error={errors.line1} t={t} />
            <View style={styles.fieldRow}>
              <View style={styles.fieldCity}>
                <Field label="CITY" placeholder="Dhaka" value={form.city} onChange={onChange('city')} error={errors.city} t={t} />
              </View>
              <View style={styles.fieldZip}>
                <Field label="POSTAL" placeholder="" value={form.zip} onChange={onChange('zip')} error={errors.zip} t={t} keyboardType="number-pad" />
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View>
            {PAYMENT_OPTIONS.map((opt) => {
              const active = form.payment === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => setForm((f) => ({ ...f, payment: opt.id }))}
                  style={[
                    styles.shipOpt,
                    { backgroundColor: t.surface, borderColor: active ? t.ink : t.line },
                  ]}
                >
                  <View style={styles.shipOptText}>
                    <Text style={[styles.shipOptLabel, { color: t.ink }]}>{opt.label}</Text>
                    <Text style={[styles.shipOptSub, { color: t.ink3 }]}>{opt.sub}</Text>
                  </View>
                </Pressable>
              );
            })}
            <View style={styles.encRow}>
              <IconShield color={t.ink3} size={14} />
              <Text style={[styles.encText, { color: t.ink3 }]}>
                Demo checkout — no real charge will occur.
              </Text>
            </View>
          </View>
        )}

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
          {busy ? 'Placing…' : step < 2 ? 'Continue' : `Place order · ${formatPrice(grand, currency)}`}
        </FragButton>
      </View>
    </View>
  );
}
