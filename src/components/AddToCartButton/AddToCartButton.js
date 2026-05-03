import React, { useCallback } from 'react';
import { Pressable, Text } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { isInStock } from '../../utils/sortStock';
import { IconBag, IconPlus } from '../Icons';

// Inline add-to-cart button used inside ProductCard, search rows, etc.
// Behavior: ALWAYS opens the QuickView modal so the user reviews
// units/qty before committing. Direct cart additions only happen
// from inside the modal itself.
export default function AddToCartButton({
  product,
  size = 'default', // 'default' | 'compact' | 'icon'
  full = false,
  label,
  iconOverride,
}) {
  const t = useTheme();
  const { openQuickView } = useStore();
  const inStock = isInStock(product);

  const onPress = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!inStock || !product?.id) return;
      openQuickView(product.id);
    },
    [openQuickView, product, inStock],
  );

  if (!product) return null;

  const disabled = !inStock;
  const Icon = iconOverride || IconPlus;

  if (size === 'icon') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={inStock ? 'Add to cart' : 'Out of stock'}
        style={({ pressed }) => [
          {
            width: 32,
            height: 32,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: disabled ? t.surfaceAlt : t.terra,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Icon size={16} color={disabled ? t.ink3 : '#FFFFFF'} />
      </Pressable>
    );
  }

  const isCompact = size === 'compact';
  const heightStyle = isCompact ? 30 : 36;
  const padX = isCompact ? 12 : 14;
  const fontSize = isCompact ? 12 : 13;

  const labelText = label || (inStock ? 'Add to Cart' : 'Out of stock');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={inStock ? 'Add to cart' : 'Out of stock'}
      style={({ pressed }) => [
        {
          height: heightStyle,
          paddingHorizontal: padX,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          backgroundColor: disabled ? 'transparent' : t.terra,
          borderWidth: disabled ? 1 : 0,
          borderColor: disabled ? t.line : 'transparent',
          alignSelf: full ? 'stretch' : 'flex-start',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {!disabled && !isCompact ? <Icon size={14} color="#FFFFFF" /> : null}
      <Text
        style={{
          fontFamily: t.fonts.sansSemiBold,
          fontSize,
          color: disabled ? t.ink3 : '#FFFFFF',
          letterSpacing: 0.2,
        }}
      >
        {labelText}
      </Text>
    </Pressable>
  );
}

// Search rows want a basket-icon-only button. Same modal-first behavior.
export function BasketIconButton({ product, size = 36 }) {
  const t = useTheme();
  const { openQuickView } = useStore();
  const inStock = isInStock(product);
  const disabled = !inStock;
  return (
    <Pressable
      onPress={(e) => {
        e?.stopPropagation?.();
        if (!inStock || !product?.id) return;
        openQuickView(product.id);
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={inStock ? 'Add to cart' : 'Out of stock'}
      style={({ pressed }) => ({
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: disabled ? t.surfaceAlt : t.terra,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <IconBag size={Math.round(size * 0.5)} color={disabled ? t.ink3 : '#FFFFFF'} />
    </Pressable>
  );
}
