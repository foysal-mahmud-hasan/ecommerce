import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileHeader from '../../components/MobileHeader';
import { verifyOtp } from '../../api/auth';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';

export default function OtpScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams();
  const { signIn, showToast } = useStore();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      const session = await verifyOtp({ phone: String(phone), code, name });
      signIn(session);
      showToast('Signed in');
      router.replace('/(tabs)/me');
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MobileHeader title="Verify" onBack={() => router.back()} />
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
            Enter the 4-digit code we sent to <Text style={{ color: t.ink }}>{phone}</Text>. In
            this preview, any 4 digits work.
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
            Code
          </Text>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 4))}
            placeholder="• • • •"
            placeholderTextColor={t.ink4}
            keyboardType="number-pad"
            autoFocus
            maxLength={4}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: error ? t.sale : t.lineStrong,
              fontFamily: t.fonts.sansSemiBold,
              fontSize: 32,
              letterSpacing: 12,
              color: t.ink,
              paddingVertical: 12,
            }}
          />
          {error ? (
            <Text style={{ color: t.sale, fontFamily: t.fonts.sans, fontSize: 12, marginTop: 8 }}>
              {error}
            </Text>
          ) : null}
          <Text
            style={{
              fontFamily: t.fonts.mono,
              fontSize: 11,
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              color: t.ink3,
              marginTop: 28,
              marginBottom: 8,
            }}
          >
            Your name (optional)
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="How should we address you?"
            placeholderTextColor={t.ink4}
            style={{
              borderBottomWidth: 1,
              borderBottomColor: t.line,
              fontFamily: t.fonts.sansMedium,
              fontSize: 16,
              color: t.ink,
              paddingVertical: 10,
            }}
          />
        </View>
        <Pressable
          disabled={busy || code.length !== 4}
          onPress={submit}
          style={{
            backgroundColor: t.ink,
            paddingVertical: 16,
            borderRadius: 28,
            alignItems: 'center',
            opacity: busy || code.length !== 4 ? 0.4 : 1,
          }}
        >
          <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 14 }}>
            {busy ? 'Verifying…' : 'Verify and continue'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
