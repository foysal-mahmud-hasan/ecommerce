import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, layout } from '../../theme';
import { IconChevL } from '../Icons';
import { styles } from './MobileHeader.styles';

export default function MobileHeader({ title, onBack, right, serif = true }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8, backgroundColor: t.bg }]}>
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
