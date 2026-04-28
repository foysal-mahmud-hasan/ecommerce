import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconStar } from '../Icons';
import { styles } from './Rating.styles';

export default function Rating({ value, reviews, size = 12 }) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      <IconStar size={size} color={t.ink} />
      <Text style={[styles.value, { color: t.ink2 }]}>{value.toFixed(1)}</Text>
      {reviews != null && (
        <Text style={[styles.reviews, { color: t.ink3 }]}>({reviews})</Text>
      )}
    </View>
  );
}
