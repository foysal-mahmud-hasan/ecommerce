import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout } from '../../theme';
import { styles } from './Chip.styles';

export default function Chip({ children, active, onPress, style, leading }) {
  const t = useTheme();
  const activeBg = t.chipActiveBg || t.ink;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: active ? activeBg : 'transparent',
          borderColor: active ? activeBg : t.line,
          opacity: pressed ? 0.85 : 1,
          flexDirection: 'row',
          gap: 6,
        },
        style,
      ]}
    >
      {leading ? <View style={{ marginRight: 2 }}>{leading}</View> : null}
      <Text style={[styles.text, { color: active ? t.bg : t.ink2 }]} numberOfLines={1}>
        {children}
      </Text>
    </Pressable>
  );
}
