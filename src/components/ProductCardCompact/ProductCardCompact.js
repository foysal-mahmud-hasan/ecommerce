import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../theme';
import { percentOff } from '../../utils/format';
import Badge from '../Badge';
import Price from '../Price';
import RemoteImage from '../RemoteImage';
import { styles } from './ProductCardCompact.styles';

export default function ProductCardCompact({ product, onPress, width = 160 }) {
  const t = useTheme();
  const discount = percentOff(product.price, product.was);
  return (
    <Pressable onPress={onPress} style={[styles.wrap, { width }]}>
      <View style={styles.imageBox}>
        <RemoteImage product={product} aspectRatio={1} radius={8} />
        {discount > 0 ? (
          <View style={styles.badge}>
            <Badge tone="sale">-{discount}%</Badge>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: t.ink }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Price price={product.price} was={product.was} size={12} />
        </View>
      </View>
    </Pressable>
  );
}
