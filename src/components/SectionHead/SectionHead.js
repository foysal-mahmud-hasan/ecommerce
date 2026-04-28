import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme, layout } from '../../theme';
import { IconChevR } from '../Icons';
import { styles } from './SectionHead.styles';

export default function SectionHead({
  eyebrow,
  title,
  action,
  onAction,
  serif = true,
}) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.titleCol}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: t.ink3 }]}>{eyebrow}</Text>
        ) : null}
        <Text
          style={[serif ? styles.titleSerif : styles.titleSans, { color: t.ink }]}
        >
          {title}
        </Text>
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={layout.hitSlop} style={styles.action}>
          <Text style={[styles.actionText, { color: t.ink2, borderColor: t.lineStrong }]}>
            {action}
          </Text>
          <IconChevR color={t.ink2} size={14} />
        </Pressable>
      ) : null}
    </View>
  );
}
