import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout } from '../../theme';
import { styles } from './Chip.styles';

// Selection rule: active chips render as transparent fill + brand-color
// border + brand-color text. Solid-fill selection is reserved for primary
// CTAs (Add to Cart, checkout); using it for filter selection makes the
// list feel like a row of buttons and steals attention from the real CTAs.
export default function Chip({ children, active, onPress, style, leading }) {
  const t = useTheme();
  const accent = t.terra;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: 'transparent',
          borderColor: active ? accent : t.line,
          borderWidth: active ? 1.5 : 1,
          opacity: pressed ? 0.85 : 1,
          flexDirection: 'row',
          gap: 6,
        },
        style,
      ]}
    >
      {leading ? <View style={{ marginRight: 2 }}>{leading}</View> : null}
      <Text
        style={[
          styles.text,
          { color: active ? accent : t.ink2, fontFamily: active ? t.fonts.sansSemiBold : undefined },
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </Pressable>
  );
}
