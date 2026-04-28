import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme, layout } from '../../theme';
import { formatPrice, percentOff } from '../../utils/format';
import Badge from '../Badge';
import { IconHeart } from '../Icons';
import Price from '../Price';
import RemoteImage from '../RemoteImage';
import Rating from '../Rating';
import { styles } from './ProductCard.styles';

export default function ProductCard({ product, onPress, onLongPress, showWishlist = true }) {
  const t = useTheme();
  const { wishlist, toggleWishlist, currency } = useStore();
  const saved = wishlist.includes(product.id);
  const discount = percentOff(product.price, product.was);
  const variant = t.cardVariant || 'editorial'; // 'editorial' | 'clinical' | 'warm'
  const aspect = t.productCardImageRatio || 1;

  // Pharma/clinical: small thumb on the left, info dense on the right.
  if (variant === 'clinical') {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.92 : 1,
            backgroundColor: t.surface,
            borderColor: t.line,
            borderWidth: 1,
            borderRadius: 12,
            padding: 10,
            flexDirection: 'row',
            gap: 10,
          },
        ]}
      >
        <View style={{ width: 76, height: 76 }}>
          <RemoteImage product={product} fit radius={8} />
          {discount > 0 ? (
            <View style={[styles.badgeBox, { top: 4, left: 4 }]}>
              <Badge tone="sale">-{discount}%</Badge>
            </View>
          ) : null}
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between', minHeight: 76 }}>
          {product.brand ? (
            <Text style={[styles.brand, { color: t.ink3 }]} numberOfLines={1}>
              {product.brand}
            </Text>
          ) : null}
          <Text style={[styles.name, { color: t.ink }]} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.row}>
            <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 14, color: t.ink }}>
              {formatPrice(product.price, currency)}
            </Text>
            {t.showStockChip && product.stock !== undefined ? (
              <Text
                style={{
                  fontFamily: t.fonts.mono,
                  fontSize: 10,
                  color: product.stock > 0 ? t.success : t.sale,
                }}
              >
                {product.stock > 0 ? 'In stock' : 'Out'}
              </Text>
            ) : null}
          </View>
        </View>
        {showWishlist ? (
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            hitSlop={layout.hitSlop}
            style={{ padding: 4 }}
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <IconHeart size={16} color={saved ? t.terra : t.ink3} filled={saved} />
          </Pressable>
        ) : null}
      </Pressable>
    );
  }

  // Editorial (Fragouras default) / warm (restaurant) — share the same card
  // shape but draw from theme colors. Restaurant gets a slightly taller image.
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
    >
      <View style={styles.imageWrap}>
        <RemoteImage product={product} aspectRatio={aspect} radius={12} />
        {discount > 0 ? (
          <View style={styles.badgeBox}>
            <Badge tone="sale">-{discount}%</Badge>
          </View>
        ) : null}
        {showWishlist ? (
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            hitSlop={layout.hitSlop}
            style={[styles.heart, { backgroundColor: t.glass }]}
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <IconHeart size={16} color={saved ? t.terra : t.ink} filled={saved} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.body}>
        {t.showProductBrand !== false && product.brand ? (
          <Text style={[styles.brand, { color: t.ink3 }]} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}
        <Text style={[styles.name, { color: t.ink }]} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Price price={product.price} was={product.was} size={13} />
          {t.showProductRating ? <Rating value={product.rating} size={10} /> : null}
        </View>
      </View>
    </Pressable>
  );
}
