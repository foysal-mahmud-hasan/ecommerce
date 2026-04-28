import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FragButton from '../../components/FragButton';
import { IconMinus, IconPlus, IconX } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import RemoteImage from '../../components/RemoteImage';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { styles } from './CartScreen.styles';

export default function CartScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, updateQty, removeFromCart, productsCache, currency, openQuickView } = useStore();
  const productMap = productsCache?.byId || {};
  const total = fragCartTotal(cart, productMap);
  const count = fragCartCount(cart);
  const grand = total;

  if (cart.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg }]}>
        <MobileHeader title="Cart" />
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: t.ink }]}>Your bag is empty</Text>
          <Text style={[styles.emptySub, { color: t.ink3 }]}>
            Saved items land here.
          </Text>
          <View style={styles.emptyBtnRow}>
            <FragButton variant="ink" size="md" onPress={() => router.push('/(tabs)')}>
              Start shopping
            </FragButton>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader title="Cart" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.buyBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.count, { color: t.ink3 }]}>
          {count} item{count !== 1 ? 's' : ''}
        </Text>
        <View style={styles.list}>
          {cart.map((item, i) => {
            const p = productMap[item.id];
            if (!p) return null;
            const variantText = item.variant?.unit || p.unit || '';
            return (
              <Pressable
                key={`${item.id}-${i}`}
                onPress={() => openQuickView(item.id)}
                style={[styles.row, { backgroundColor: t.surface, borderColor: t.line }]}
              >
                <View style={styles.imgBox}>
                  <RemoteImage product={p} aspectRatio={1} radius={8} />
                </View>
                <View style={styles.info}>
                  {p.brand ? (
                    <Text style={[styles.brand, { color: t.ink3 }]} numberOfLines={1}>
                      {p.brand}
                    </Text>
                  ) : null}
                  <Text style={[styles.name, { color: t.ink }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={[styles.variant, { color: t.ink3 }]}>{variantText}</Text>
                  <View style={styles.bottomRow}>
                    <View style={[styles.qty, { borderColor: t.line }]}>
                      <Pressable
                        onPress={() => updateQty(i, item.qty - 1)}
                        hitSlop={layout.hitSlop}
                      >
                        <IconMinus color={t.ink} />
                      </Pressable>
                      <Text style={[styles.qtyNum, { color: t.ink }]}>{item.qty}</Text>
                      <Pressable
                        onPress={() => updateQty(i, item.qty + 1)}
                        hitSlop={layout.hitSlop}
                      >
                        <IconPlus color={t.ink} />
                      </Pressable>
                    </View>
                    <Text style={[styles.lineTotal, { color: t.ink }]}>
                      {formatPrice(p.price * item.qty, currency)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation?.();
                    removeFromCart(i);
                  }}
                  hitSlop={layout.hitSlop}
                  style={{ position: 'absolute', top: 8, right: 8, padding: 4 }}
                  accessibilityLabel="Remove from cart"
                >
                  <IconX color={t.ink3} size={14} />
                </Pressable>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.totalsCard, { backgroundColor: t.surfaceAlt }]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: t.ink2 }]}>Subtotal</Text>
            <Text style={[styles.totalValue, { color: t.ink2 }]}>
              {formatPrice(total, currency)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: t.ink2 }]}>Shipping</Text>
            <Text style={[styles.totalValue, { color: t.ink2 }]}>Calculated at checkout</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: t.line }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.grandLabel, { color: t.ink }]}>Total</Text>
            <Text style={[styles.grandValue, { color: t.ink }]}>
              {formatPrice(grand, currency)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: t.bg,
            borderTopColor: t.line,
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <FragButton
          variant="primary"
          size="lg"
          full
          onPress={() => router.push('/checkout')}
        >
          {`Checkout · ${formatPrice(grand, currency)}`}
        </FragButton>
      </View>
    </View>
  );
}
