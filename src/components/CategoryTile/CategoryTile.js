import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconChevR } from '../Icons';

export default function CategoryTile({ label, icon, bg, accent, onPress }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          backgroundColor: bg || t.surfaceAlt,
          borderRadius: 14,
          paddingVertical: 18,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.7)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            fontFamily: t.fonts.sansSemiBold,
            fontSize: 15,
            color: t.ink,
            flex: 1,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      <IconChevR size={16} color={accent || t.ink2} />
    </Pressable>
  );
}
