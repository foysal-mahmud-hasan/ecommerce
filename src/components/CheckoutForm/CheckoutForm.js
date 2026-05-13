import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { IconShield } from '../Icons';
import { useTheme } from '../../theme';
import { styles } from './CheckoutForm.styles';

export const PAYMENT_OPTIONS = [
  { id: 'cod', label: 'Cash on delivery', sub: 'Pay in cash when your order arrives.' },
  { id: 'sslcommerz', label: 'SSLCommerz', sub: 'Card, mobile banking, net banking (BDT).' },
  { id: 'stripe', label: 'Credit / debit card', sub: 'Secure checkout via Stripe.' },
];

// Filter the option list against the gateways supported for the order's
// currency. Currency-agnostic methods (COD) always pass through.
export function filterPaymentOptions(allowedIds) {
  const allow = new Set(allowedIds);
  return PAYMENT_OPTIONS.filter((opt) => allow.has(opt.id));
}

// Returns { ok, errors }. Used by both CheckoutScreen and CartSheet.
export function validateAddress(form) {
  const e = {};
  ['name', 'phone', 'line1', 'city'].forEach((f) => {
    if (!form[f] || String(form[f]).trim().length < 2) e[f] = 'Required';
  });
  if (form.phone && form.phone.replace(/\D/g, '').length < 7) e.phone = 'Invalid';
  return { ok: Object.keys(e).length === 0, errors: e };
}

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

// `step` 0 = address, 1 = payment.
// `form` shape: { name, phone, line1, city, zip, payment }
// `onChange(key)(value)` updates a single field.
// `errors` is a key→message map.
export default function CheckoutForm({ step, form, onChange, errors = {}, paymentOptions }) {
  const t = useTheme();
  const options = paymentOptions || PAYMENT_OPTIONS;

  if (step === 0) {
    return (
      <View>
        <Field label="FULL NAME" placeholder="" value={form.name} onChange={onChange('name')} error={errors.name} t={t} />
        <Field
          label="MOBILE"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={onChange('phone')}
          error={errors.phone}
          t={t}
          keyboardType="phone-pad"
        />
        <Field
          label="ADDRESS"
          placeholder="House, road, area"
          value={form.line1}
          onChange={onChange('line1')}
          error={errors.line1}
          t={t}
        />
        <View style={styles.fieldRow}>
          <View style={styles.fieldCity}>
            <Field label="CITY" placeholder="Dhaka" value={form.city} onChange={onChange('city')} error={errors.city} t={t} />
          </View>
          <View style={styles.fieldZip}>
            <Field
              label="POSTAL"
              placeholder=""
              value={form.zip}
              onChange={onChange('zip')}
              error={errors.zip}
              t={t}
              keyboardType="number-pad"
            />
          </View>
        </View>
      </View>
    );
  }

  // Payment step
  return (
    <View>
      {options.map((opt) => {
        const active = form.payment === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => onChange('payment')(opt.id)}
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
          Sandbox checkout — no real charge will be made.
        </Text>
      </View>
    </View>
  );
}
