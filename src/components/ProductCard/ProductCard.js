import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme, layout } from '../../theme';
import { formatPrice, percentOff } from '../../utils/format';
import { isInStock } from '../../utils/sortStock';
import AddToCartButton from '../AddToCartButton';
import Badge from '../Badge';
import { IconHeart } from '../Icons';
import Price from '../Price';
import RemoteImage from '../RemoteImage';
import Rating from '../Rating';
import { styles } from './ProductCard.styles';

export default function ProductCard({
  product,
  onPress,
  onLongPress,
  showWishlist = true,
  showAddButton = true,
  forceLayout, // 'clinical' | 'editorial' — overrides theme cardVariant
  compact = false, // shorter image + tighter spacing for dense grids (catalog)
}) {
  const t = useTheme();
  const { wishlist, toggleWishlist, currency } = useStore();
  const saved = wishlist.includes(product.id);
  const discount = percentOff(product.price, product.was);
  const themeVariant = t.cardVariant || 'editorial'; // 'editorial' | 'clinical' | 'warm'
  const variant = forceLayout || themeVariant;
  const themeAspect = t.productCardImageRatio || 1;
  // Compact = 4:5 portrait (image height ≈ 80% of width). Default = theme.
  const aspect = compact ? 1.25 : themeAspect;
  const inStock = isInStock(product);

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
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 14, color: t.ink }}>
                {formatPrice(product.price, currency)}
              </Text>
              {t.showStockChip && product.stock !== undefined ? (
                <Text
                  style={{
                    fontFamily: t.fonts.mono,
                    fontSize: 10,
                    color: inStock ? t.success : t.sale,
                  }}
                >
                  {inStock ? 'In stock' : 'Out'}
                </Text>
              ) : null}
            </View>
            {showAddButton ? <AddToCartButton product={product} size="compact" /> : null}
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

  // Editorial / warm — image on top, info below, Add button at bottom.
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
        {!inStock ? (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 999,
              backgroundColor: t.bg,
              borderWidth: 1,
              borderColor: t.line,
            }}
          >
            <Text
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 9,
                letterSpacing: 0.6,
                color: t.sale,
              }}
            >
              OUT
            </Text>
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
      <View style={[styles.body, compact && { paddingTop: 8 }]}>
        {t.showProductBrand !== false && product.brand ? (
          <Text
            style={[styles.brand, { color: t.ink3 }, compact && { fontSize: 9, marginBottom: 2 }]}
            numberOfLines={1}
          >
            {product.brand}
          </Text>
        ) : null}
        <Text
          style={[
            styles.name,
            { color: t.ink },
            compact && { fontSize: 13, lineHeight: 16, marginBottom: 2 },
          ]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        {product.unit ? (
          <Text
            style={{
              fontFamily: t.fonts.sans,
              fontSize: compact ? 10 : 11,
              color: t.ink3,
              marginBottom: compact ? 4 : 6,
            }}
            numberOfLines={1}
          >
            {product.unit}
          </Text>
        ) : null}
        <View style={styles.row}>
          <Price price={product.price} was={product.was} size={compact ? 12 : 13} />
          {t.showProductRating ? <Rating value={product.rating} size={10} /> : null}
        </View>
        {showAddButton ? (
          <View style={{ marginTop: compact ? 6 : 10 }}>
            <AddToCartButton product={product} size={compact ? 'compact' : 'default'} full />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
