import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileHeader from '../../components/MobileHeader';
import { requestOtp } from '../../api/auth';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { useIsWebWide } from '../../utils/responsive';

export default function PhoneScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webWide = useIsWebWide();
  const { showToast, credentials } = useStore();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await requestOtp({ credentials, phone });
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e) {
      setError(e.message);
      showToast(e.message);
    } finally {
      setBusy(false);
    }
  };

  const body = (
    <View>
      <Text
        style={{
          fontFamily: t.fonts.sans,
          fontSize: 14,
          color: t.ink3,
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        We'll send a 5-digit code to verify it's you. Standard SMS rates apply.
      </Text>
      <Text
        style={{
          fontFamily: t.fonts.mono,
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: t.ink3,
          marginBottom: 8,
        }}
      >
        Mobile number
      </Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="01XXXXXXXXX"
        placeholderTextColor={t.ink4}
        keyboardType="phone-pad"
        autoFocus
        style={{
          borderBottomWidth: 1,
          borderBottomColor: error ? t.sale : t.lineStrong,
          fontFamily: t.fonts.sansMedium,
          fontSize: 22,
          color: t.ink,
          paddingVertical: 12,
        }}
      />
      {error ? (
        <Text style={{ color: t.sale, fontFamily: t.fonts.sans, fontSize: 12, marginTop: 8 }}>
          {error}
        </Text>
      ) : null}
    </View>
  );

  const cta = (
    <Pressable
      disabled={busy}
      onPress={submit}
      style={{
        backgroundColor: t.ink,
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: 'center',
        opacity: busy ? 0.6 : 1,
      }}
    >
      <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 14 }}>
        {busy ? 'Sending…' : 'Send code'}
      </Text>
    </Pressable>
  );

  if (webWide) {
    return (
      <View style={{ flex: 1, backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <View
          style={{
            width: '100%',
            maxWidth: 460,
            backgroundColor: t.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: t.line,
            padding: 40,
          }}
        >
          <Pressable onPress={() => router.back()} style={{ marginBottom: 18 }}>
            <Text style={{ color: t.ink3, fontFamily: t.fonts.sansMedium, fontSize: 13 }}>← Back</Text>
          </Pressable>
          <Text style={{ fontFamily: t.fonts.display, fontSize: 26, color: t.ink, marginBottom: 20 }}>
            Your phone
          </Text>
          {body}
          <View style={{ marginTop: 28 }}>{cta}</View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MobileHeader title="Your phone" onBack={() => router.back()} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: 28,
          paddingTop: 24,
          paddingBottom: insets.bottom + 24,
          justifyContent: 'space-between',
        }}
      >
        {body}
        {cta}
      </View>
    </View>
  );
}
