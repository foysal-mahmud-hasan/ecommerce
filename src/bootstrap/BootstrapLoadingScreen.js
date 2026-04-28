import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '../theme';

export default function BootstrapLoadingScreen() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg }}>
      <ActivityIndicator color={t.terra} />
      <Text style={{ marginTop: 16, color: t.ink3, fontFamily: t.fonts.sans, fontSize: 13 }}>
        Loading store…
      </Text>
    </View>
  );
}
