import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { isInStock } from '../../utils/sortStock';
import { IconPlus } from '../Icons';

// Inline add-to-cart button used inside ProductCard, search rows, etc.
// Variants:
//   - "compact": small pill, icon only or tiny label (search rows / dense cards)
//   - "default": full pill with label
// Behavior:
//   - OOS state shows disabled button with "Out of stock" label
//   - Stops the parent Pressable's press handler (Pressable inside Pressable
//     naturally captures the press in RN, so no explicit stop needed).
export default function AddToCartButton({
  product,
  size = 'default', // 'default' | 'compact' | 'icon'
  full = false,
  label,
}) {
  const t = useTheme();
  const { addToCart } = useStore();
  const inStock = isInStock(product);

  const onPress = useCallback(
    (e) => {
      // Defensive — make sure parent doesn't also fire on web.
      e?.stopPropagation?.();
      if (!inStock || !product?.id) return;
      addToCart(product.id, 1, {
        unit: product.unit,
        unitId: product.unitId,
        price: product.price,
      });
    },
    [addToCart, product, inStock],
  );

  if (!product) return null;

  const disabled = !inStock;

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
            backgroundColor: disabled ? t.surfaceAlt : t.ink,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <IconPlus size={16} color={disabled ? t.ink3 : t.bg} />
      </Pressable>
    );
  }

  const isCompact = size === 'compact';
  const heightStyle = isCompact ? 30 : 36;
  const padX = isCompact ? 12 : 14;
  const fontSize = isCompact ? 12 : 13;

  const labelText = label || (inStock ? 'Add' : 'Out of stock');

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
          borderRadius: 999,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 6,
          backgroundColor: disabled ? 'transparent' : t.ink,
          borderWidth: disabled ? 1 : 0,
          borderColor: disabled ? t.line : 'transparent',
          alignSelf: full ? 'stretch' : 'flex-start',
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {!disabled && !isCompact ? <IconPlus size={12} color={t.bg} /> : null}
      <Text
        style={{
          fontFamily: t.fonts.sansSemiBold,
          fontSize,
          color: disabled ? t.ink3 : t.bg,
          letterSpacing: 0.2,
        }}
      >
        {labelText}
      </Text>
    </Pressable>
  );
}
