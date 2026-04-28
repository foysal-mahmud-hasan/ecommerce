import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme';

export default function BootstrapErrorScreen({ error, onRetry }) {
  const t = useTheme();
  const msg = error?.kind === 'timeout'
    ? 'The store is taking too long to respond.'
    : error?.kind === 'network'
      ? 'No internet connection.'
      : 'Something went wrong loading the store.';
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: t.bg,
        paddingHorizontal: 32,
      }}
    >
      <Text
        style={{
          fontFamily: t.fonts.display,
          fontSize: 22,
          color: t.ink,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        Unable to load
      </Text>
      <Text
        style={{
          fontFamily: t.fonts.sans,
          fontSize: 13,
          color: t.ink3,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 20,
        }}
      >
        {msg}
      </Text>
      <Pressable
        onPress={onRetry}
        style={{
          backgroundColor: t.ink,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 24,
        }}
      >
        <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 13 }}>
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
