import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { styles } from './Badge.styles';

export default function Badge({ children, tone = 'ink', style }) {
  const t = useTheme();
  const tones = {
    ink: { bg: t.ink, color: t.bg },
    sale: { bg: t.sale, color: t.white },
    quiet: { bg: t.surfaceAlt, color: t.ink2 },
    cream: { bg: t.cream, color: t.ink },
  };
  const s = tones[tone] || tones.ink;
  return (
    <View style={[styles.badge, { backgroundColor: s.bg }, style]}>
      <Text style={[styles.text, { color: s.color }]}>{children}</Text>
    </View>
  );
}
