import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, layout } from '../../theme';
import { IconChevL } from '../Icons';
import { useIsWebWide } from '../../utils/responsive';
import { styles } from './MobileHeader.styles';

// Navbar elevation rule: header sits on `t.surface` (white) with a 1px
// bottom hairline + a soft web shadow. The body of every screen uses `t.bg`
// (cream / off-white), so the white header reads as a separate surface
// without needing a heavy color block.
export default function MobileHeader({ title, onBack, right, serif = true }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const webWide = useIsWebWide();

  // On web ≥768 the global DesktopTopNav supplies all navigation chrome, so
  // this renders only a left-aligned page heading (no back arrow, no mobile
  // surface bar) — avoids the duplicate header row under the top nav.
  if (webWide) {
    if (!title && !right) return null;
    return (
      <View style={styles.webWrap}>
        {title ? (
          <Text
            style={[styles.webTitle, { color: t.ink, fontFamily: serif ? t.fonts.serif : t.fonts.sansSemiBold }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View style={styles.flex1} />
        )}
        {right ? <View>{right}</View> : null}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          paddingTop: insets.top + 8,
          backgroundColor: t.surface,
          borderBottomColor: t.line,
          borderBottomWidth: 1,
          ...(Platform.OS === 'web'
            ? { boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }
            : null),
        },
      ]}
    >
      <View style={styles.row}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={layout.hitSlop}
            style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
          >
            <IconChevL color={t.ink} size={16} />
          </Pressable>
        ) : (
          <View style={styles.spacer} />
        )}
        {title ? (
          <Text
            style={[
              serif ? styles.titleSerif : styles.titleSans,
              { color: t.ink },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          <View style={styles.flex1} />
        )}
        <View style={styles.rightBox}>{right || null}</View>
      </View>
    </View>
  );
}
