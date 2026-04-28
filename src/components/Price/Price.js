import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { useStore } from '../../store/StoreContext';
import { formatPrice } from '../../utils/format';
import { makeStyles } from './Price.styles';

export default function Price({ price, was, size = 14, bold = true }) {
  const t = useTheme();
  const { currency } = useStore();
  const styles = makeStyles(size, bold);
  return (
    <View style={styles.row}>
      <Text style={[styles.price, { color: t.ink }]}>{formatPrice(price, currency)}</Text>
      {was ? (
        <Text style={[styles.was, { color: t.ink3 }]}>{formatPrice(was, currency)}</Text>
      ) : null}
    </View>
  );
}
