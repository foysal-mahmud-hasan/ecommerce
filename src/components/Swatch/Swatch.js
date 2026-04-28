import React from 'react';
import { Pressable, View } from 'react-native';
import { swatchPalette, useTheme } from '../../theme';
import { styles } from './Swatch.styles';

export default function Swatch({ color, active, onPress, size = 22 }) {
  const t = useTheme();
  const fill = swatchPalette[color] || '#999';
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={color}
      style={[
        styles.outer,
        {
          width: size + 6,
          height: size + 6,
          borderColor: active ? t.ink : 'transparent',
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          { width: size, height: size, backgroundColor: fill },
        ]}
      />
    </Pressable>
  );
}
