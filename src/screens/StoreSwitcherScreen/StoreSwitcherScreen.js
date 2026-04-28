import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileHeader from '../../components/MobileHeader';
import { useBootstrap } from '../../bootstrap/BootstrapProvider';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';

export default function StoreSwitcherScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { switchTenant } = useBootstrap();
  const { showToast } = useStore();
  const [licenseKey, setLicenseKey] = useState('');
  const [activeKey, setActiveKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!licenseKey.trim() || !activeKey.trim()) {
      setError('Both keys are required');
      return;
    }
    setBusy(true);
    try {
      await switchTenant({
        credentials: { license_key: licenseKey.trim(), active_key: activeKey.trim() },
      });
      showToast('Switched store');
      router.replace('/(tabs)');
    } catch (e) {
      setError(e.message || 'Failed to switch store');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <MobileHeader title="Sign in to a store" onBack={() => router.back()} />
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
            Enter the license key and activation key for your store. You can find these
            in your store admin.
          </Text>
          {[
            { label: 'License key', value: licenseKey, set: setLicenseKey },
            { label: 'Activation key', value: activeKey, set: setActiveKey },
          ].map((f) => (
            <View key={f.label} style={{ marginBottom: 20 }}>
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
                {f.label}
              </Text>
              <TextInput
                value={f.value}
                onChangeText={f.set}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: t.lineStrong,
                  fontFamily: t.fonts.sansMedium,
                  fontSize: 16,
                  color: t.ink,
                  paddingVertical: 10,
                }}
              />
            </View>
          ))}
          {error ? (
            <Text style={{ color: t.sale, fontFamily: t.fonts.sans, fontSize: 13 }}>{error}</Text>
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
            {busy ? 'Connecting…' : 'Connect'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
