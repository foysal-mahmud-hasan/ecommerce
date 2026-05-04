import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { IconChevR } from '../Icons';
import { styles } from './SectionHead.styles';

export default function SectionHead({
  eyebrow,
  title,
  action,
  onAction,
  serif = true,
  rightSlot,
}) {
  const t = useTheme();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const titleStyle = serif
    ? [styles.titleSerif, isMobile && styles.titleSerifMobile]
    : [styles.titleSans, isMobile && styles.titleSansMobile];
  return (
    <View style={styles.row}>
      <View style={styles.titleCol}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: t.ink3 }]} numberOfLines={1}>{eyebrow}</Text>
        ) : null}
        <Text
          style={[...titleStyle, { color: t.ink }]}
          numberOfLines={isMobile ? 1 : 2}
        >
          {title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {action ? (
          <Pressable onPress={onAction} hitSlop={layout.hitSlop} style={styles.action}>
            <Text style={[styles.actionText, { color: t.terra, borderColor: t.lineStrong }]}>
              {action}
            </Text>
            <IconChevR color={t.terra} size={14} />
          </Pressable>
        ) : null}
        {rightSlot}
      </View>
    </View>
  );
}
