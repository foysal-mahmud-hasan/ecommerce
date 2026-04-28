import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileHeader from '../../components/MobileHeader';
import { requestOtp } from '../../api/auth';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';

export default function PhoneScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useStore();
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      await requestOtp({ phone });
      router.push({ pathname: '/(auth)/otp', params: { phone } });
    } catch (e) {
      setError(e.message);
      showToast(e.message);
    } finally {
      setBusy(false);
    }
  };

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
            We'll send a 4-digit code to verify it's you. Standard SMS rates apply.
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
      </View>
    </View>
  );
}
