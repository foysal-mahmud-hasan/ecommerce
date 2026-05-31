import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout as themeLayout } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { styles } from './Tabs.styles';

// Segmented tabs with an underline indicator. Used in places where the
// option set is small (≤ ~6) and stable, so the user benefits from seeing
// every option at once instead of horizontal-scrolling a chip rail.
//
// Mobile: each tab takes 1/N of the row (flex:1) so all options are
// touch-reachable without scrolling.
// Tablet/desktop: each tab is auto-width, left-aligned with horizontal
// padding so the indicator hugs the label.
export default function Tabs({ items, value, onChange, contentPadding = 16 }) {
  const t = useTheme();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const accent = t.terra;

  return (
    <View style={[styles.bar, { borderBottomColor: t.line, paddingHorizontal: contentPadding }]}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange?.(item.id)}
            hitSlop={themeLayout.hitSlop}
            style={({ pressed }) => [
              styles.tab,
              isMobile ? styles.tabFlex : styles.tabAuto,
              { opacity: pressed ? 0.85 : 1 },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? accent : t.ink3,
                  fontFamily: active ? t.fonts.sansSemiBold : t.fonts.sansMedium,
                },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            <View
              style={[
                styles.indicator,
                { backgroundColor: active ? accent : 'transparent' },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
