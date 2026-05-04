import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice, percentOff } from '../../utils/format';
import { useBreakpoint } from '../../utils/responsive';
import { isInStock } from '../../utils/sortStock';
import AddToCartButton from '../AddToCartButton';
import Badge from '../Badge';
import { IconHeart } from '../Icons';
import Price from '../Price';
import QtyStepper from '../QtyStepper';
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
  compact = false,
}) {
  const t = useTheme();
  const router = useRouter();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const { wishlist, toggleWishlist, currency, openQuickView } = useStore();
  const saved = wishlist.includes(product.id);
  const discount = percentOff(product.price, product.was);
  const themeVariant = t.cardVariant || 'editorial';
  const variant = forceLayout || themeVariant;
  const themeAspect = t.productCardImageRatio || 1;
  const aspect = compact ? 1.25 : themeAspect;
  const inStock = isInStock(product);
  const [qty, setQty] = useState(1);

  // Default press handler: open the PDP. Callers can override with `onPress`,
  // but the design rule is "tap card → PDP, tap Add → modal".
  const handleCardPress = onPress || (() => router.push(`/product/${product.id}`));

  // Pharma/clinical: thumb left, info right with stepper + CTAs at bottom.
  if (variant === 'clinical') {
    const handleAdd = (e) => {
      e?.stopPropagation?.();
      if (!inStock || !product?.id) return;
      // Always open the modal — qty stepper on the card is for visual context
      // only; actual cart addition happens after the user confirms in the modal.
      openQuickView(product.id);
    };
    const thumbSize = isMobile ? 72 : 84;
    const heartBtn = showWishlist ? (
      <Pressable
        onPress={() => toggleWishlist(product.id)}
        hitSlop={layout.hitSlop}
        style={{ padding: 4 }}
        accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <IconHeart size={16} color={saved ? t.terra : t.ink3} filled={saved} />
      </Pressable>
    ) : null;

    const stepperEl = (
      <QtyStepper
        value={qty}
        onChange={setQty}
        min={1}
        unitLabel={product.unit ? product.unit : 'strip'}
        size="compact"
      />
    );
    const addBtn = showAddButton ? (
      <Pressable
        onPress={handleAdd}
        disabled={!inStock}
        accessibilityRole="button"
        accessibilityLabel={inStock ? 'Add to cart' : 'Out of stock'}
        style={({ pressed }) => ({
          flex: isMobile ? 1 : undefined,
          height: 32,
          paddingHorizontal: 14,
          borderRadius: 8,
          backgroundColor: inStock ? t.terra : t.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed ? 0.85 : 1,
          alignSelf: isMobile ? 'auto' : 'stretch',
        })}
      >
        <Text
          style={{
            fontFamily: t.fonts.sansSemiBold,
            fontSize: 12,
            color: inStock ? '#FFFFFF' : t.ink3,
            letterSpacing: 0.2,
          }}
          numberOfLines={1}
        >
          {inStock ? 'Add to Cart' : 'Out of stock'}
        </Text>
      </Pressable>
    ) : null;
    const viewDetails = (
      <Pressable
        onPress={(e) => {
          e?.stopPropagation?.();
          router.push(`/product/${product.id}`);
        }}
        hitSlop={6}
      >
        <Text
          style={{
            fontFamily: t.fonts.sansMedium,
            fontSize: 11,
            color: t.ink3,
            textDecorationLine: 'underline',
          }}
        >
          View Details
        </Text>
      </Pressable>
    );

    return (
      <Pressable
        onPress={handleCardPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.96 : 1,
            backgroundColor: t.surface,
            borderColor: t.line,
            borderWidth: 1,
            borderRadius: 12,
            padding: 12,
            gap: isMobile ? 10 : 0,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: thumbSize, height: thumbSize }}>
            <RemoteImage product={product} fit radius={8} />
            {discount > 0 ? (
              <View style={[styles.badgeBox, { top: 4, left: 4 }]}>
                <Badge tone="sale">-{discount}%</Badge>
              </View>
            ) : null}
          </View>
          <View style={{ flex: 1, minWidth: 0, justifyContent: 'space-between', minHeight: thumbSize }}>
            <View>
              <Text
                style={[
                  styles.name,
                  { color: t.ink, fontSize: isMobile ? 14 : 14, lineHeight: 18 },
                ]}
                numberOfLines={isMobile ? 3 : 2}
              >
                {product.name}
              </Text>
              <Text
                style={{
                  fontFamily: t.fonts.sans,
                  fontSize: 11,
                  color: t.ink3,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {product.brand || product.unit || 'Medical grade product'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 6,
                gap: 8,
              }}
            >
              <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 15, color: t.ink }}>
                {formatPrice(product.price, currency)}
              </Text>
              {heartBtn}
            </View>
          </View>
          {!isMobile ? (
            <View style={{ minWidth: 130, justifyContent: 'space-between', alignItems: 'flex-end' }}>
              {stepperEl}
              {addBtn}
              <View style={{ marginTop: 4, alignSelf: 'flex-end' }}>{viewDetails}</View>
            </View>
          ) : null}
        </View>

        {isMobile ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {stepperEl}
            {addBtn}
          </View>
        ) : null}
        {isMobile ? (
          <View style={{ alignSelf: 'flex-end' }}>{viewDetails}</View>
        ) : null}
      </Pressable>
    );
  }

  // Editorial / warm — image on top, info below, Add button at bottom.
  return (
    <Pressable
      onPress={handleCardPress}
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
            style={[styles.brand, { color: t.ink3 }, compact && { fontSize: 10, marginBottom: 2 }]}
            numberOfLines={1}
          >
            {product.brand}
          </Text>
        ) : null}
        <Text
          style={[
            styles.name,
            { color: t.ink },
            compact && { fontSize: 13, lineHeight: 17, marginBottom: 3 },
          ]}
          numberOfLines={compact ? 3 : 2}
        >
          {product.name}
        </Text>
        {product.unit ? (
          <Text
            style={{
              fontFamily: t.fonts.sans,
              fontSize: compact ? 11 : 11,
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
