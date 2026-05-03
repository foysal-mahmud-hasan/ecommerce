import React from 'react';
import { Pressable, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconGrid, IconList } from '../Icons';

export default function ViewToggle({ value = 'list', onChange }) {
  const t = useTheme();
  const buttons = [
    { id: 'list', icon: IconList, label: 'List view' },
    { id: 'grid', icon: IconGrid, label: 'Grid view' },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: t.line,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: t.surface,
      }}
    >
      {buttons.map((b, i) => {
        const Icon = b.icon;
        const active = value === b.id;
        return (
          <Pressable
            key={b.id}
            onPress={() => onChange?.(b.id)}
            accessibilityRole="button"
            accessibilityLabel={b.label}
            style={({ pressed }) => ({
              width: 34,
              height: 30,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? t.terra : 'transparent',
              borderLeftWidth: i === 0 ? 0 : 1,
              borderLeftColor: t.line,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Icon size={16} color={active ? t.bg : t.ink2} />
          </Pressable>
        );
      })}
    </View>
  );
}
