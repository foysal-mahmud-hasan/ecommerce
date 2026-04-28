import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout } from '../../theme';
import { styles } from './FragButton.styles';

export default function FragButton({
  children,
  variant = 'primary',
  size = 'md',
  full,
  onPress,
  disabled,
  leftIcon,
  rightIcon,
  style,
}) {
  const t = useTheme();

  const variants = {
    primary: { bg: t.terra, color: t.white, border: 'transparent' },
    ink: { bg: t.ink, color: t.bg, border: 'transparent' },
    ghost: { bg: 'transparent', color: t.ink, border: t.lineStrong },
    quiet: { bg: t.surfaceAlt, color: t.ink, border: 'transparent' },
    inkOnDark: { bg: t.bg, color: t.ink, border: 'transparent' },
    ghostOnDark: { bg: 'transparent', color: t.white, border: 'rgba(255,255,255,0.35)' },
  };
  const v = variants[variant] || variants.primary;
  const sizeStyle = styles[`size_${size}`];
  const textSize = styles[`text_${size}`];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={layout.hitSlop}
      style={({ pressed }) => [
        styles.base,
        sizeStyle,
        full && styles.full,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          opacity: disabled ? 0.4 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {leftIcon ? <View style={styles.iconBox}>{leftIcon}</View> : null}
      <Text style={[styles.label, textSize, { color: v.color }]} numberOfLines={1}>
        {children}
      </Text>
      {rightIcon ? <View style={styles.iconBox}>{rightIcon}</View> : null}
    </Pressable>
  );
}
