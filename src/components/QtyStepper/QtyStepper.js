import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconMinus, IconPlus } from '../Icons';

export default function QtyStepper({
  value = 1,
  onChange,
  min = 0,
  max = 999,
  unitLabel,
  size = 'default',
}) {
  const t = useTheme();
  const isCompact = size === 'compact';
  const h = isCompact ? 28 : 34;
  const btnW = isCompact ? 28 : 34;
  const fontSize = isCompact ? 12 : 13;

  const dec = () => {
    const next = Math.max(min, value - 1);
    onChange?.(next);
  };
  const inc = () => {
    const next = Math.min(max, value + 1);
    onChange?.(next);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: h,
        borderWidth: 1,
        borderColor: t.line,
        borderRadius: 8,
        backgroundColor: t.surface,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={dec}
        disabled={value <= min}
        accessibilityLabel="Decrease quantity"
        style={({ pressed }) => ({
          width: btnW,
          height: h,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: value <= min ? 0.4 : pressed ? 0.7 : 1,
        })}
      >
        <IconMinus size={14} color={t.ink} />
      </Pressable>
      <View
        style={{
          minWidth: unitLabel ? 60 : 32,
          paddingHorizontal: unitLabel ? 8 : 4,
          alignItems: 'center',
          justifyContent: 'center',
          height: h,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: t.line,
        }}
      >
        <Text
          style={{
            fontFamily: t.fonts.sansSemiBold,
            fontSize,
            color: t.ink,
          }}
          numberOfLines={1}
        >
          {unitLabel ? `${value} ${unitLabel}` : value}
        </Text>
      </View>
      <Pressable
        onPress={inc}
        disabled={value >= max}
        accessibilityLabel="Increase quantity"
        style={({ pressed }) => ({
          width: btnW,
          height: h,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: value >= max ? 0.4 : pressed ? 0.7 : 1,
        })}
      >
        <IconPlus size={14} color={t.ink} />
      </Pressable>
    </View>
  );
}
