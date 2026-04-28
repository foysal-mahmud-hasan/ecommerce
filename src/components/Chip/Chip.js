import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme, layout } from '../../theme';
import { styles } from './Chip.styles';

export default function Chip({ children, active, onPress, style }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? t.ink : 'transparent',
          borderColor: active ? t.ink : t.line,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: active ? t.bg : t.ink2 }]} numberOfLines={1}>
        {children}
      </Text>
    </Pressable>
  );
}
