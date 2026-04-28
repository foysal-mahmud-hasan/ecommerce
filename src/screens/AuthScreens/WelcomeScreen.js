import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';

export default function WelcomeScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tenant } = useStore();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.bg,
        paddingTop: insets.top + 40,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 28,
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text
          style={{
            fontFamily: t.fonts.mono,
            fontSize: 11,
            letterSpacing: 1.4,
            textTransform: 'uppercase',
            color: t.ink3,
            marginBottom: 16,
          }}
        >
          {tenant?.name || 'Welcome'}
        </Text>
        <Text style={{ fontFamily: t.fonts.display, fontSize: 36, lineHeight: 42, color: t.ink }}>
          Sign in to{'\n'}continue shopping.
        </Text>
        <Text
          style={{
            fontFamily: t.fonts.sans,
            fontSize: 15,
            color: t.ink3,
            marginTop: 16,
            lineHeight: 22,
          }}
        >
          We use your phone number to keep your cart, orders, and addresses in one
          place across devices.
        </Text>
      </View>
      <View style={{ gap: 12 }}>
        <Pressable
          onPress={() => router.push('/(auth)/phone')}
          style={{
            backgroundColor: t.ink,
            paddingVertical: 16,
            borderRadius: 28,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 14 }}>
            Continue with phone
          </Text>
        </Pressable>
        <Pressable onPress={() => router.back()} style={{ paddingVertical: 12, alignItems: 'center' }}>
          <Text style={{ color: t.ink3, fontFamily: t.fonts.sansMedium, fontSize: 13 }}>
            Maybe later
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
