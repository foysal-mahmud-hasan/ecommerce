import { usePathname } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { IconBag } from '../Icons';
import { styles } from './CartFab.styles';

// Routes where the FAB should be hidden:
// - any auth screen
// - dedicated checkout / cart screens (cart sheet would conflict with their bars)
// - tenant-switch modal
function isSuppressedPath(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith('/(auth)')) return true;
  if (pathname.startsWith('/checkout')) return true;
  if (pathname.startsWith('/tenant-switch')) return true;
  if (pathname.startsWith('/(tabs)/cart')) return true;
  if (pathname === '/cart') return true;
  return false;
}

// True when the route lives inside the (tabs) group, where the tab bar is
// visible and the FAB needs to sit above it.
function pathHasTabBar(pathname) {
  if (!pathname) return false;
  // Top-level tab paths: /, /search, /saved, /me, /products (catalog tab)
  if (pathname === '/' || pathname === '/(tabs)') return true;
  if (
    pathname.startsWith('/(tabs)/') ||
    pathname === '/search' ||
    pathname === '/saved' ||
    pathname === '/me' ||
    pathname === '/products'
  ) {
    return true;
  }
  return false;
}

export default function CartFab() {
  const t = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const {
    cart,
    productsCache,
    currency,
    openCartSheet,
    cartSheetOpen,
    quickViewProductId,
    prescriptionSheetOpen,
  } = useStore();

  const productMap = productsCache?.byId || {};
  const count = fragCartCount(cart);
  const total = fragCartTotal(cart, productMap);

  const bottomOffset = useMemo(() => {
    const base = (insets.bottom || 0) + 16;
    return pathHasTabBar(pathname) ? base + layout.tabBarHeight : base;
  }, [insets.bottom, pathname]);

  // Hide if no items, on a suppressed route, or while another sheet is up
  // (otherwise the FAB shows on top of the sheet's backdrop).
  const hidden =
    count === 0 ||
    isSuppressedPath(pathname) ||
    cartSheetOpen ||
    prescriptionSheetOpen ||
    quickViewProductId != null;

  if (hidden) return null;

  return (
    <View style={[styles.wrap, { bottom: bottomOffset }]} pointerEvents="box-none">
      <Pressable
        onPress={openCartSheet}
        accessibilityRole="button"
        accessibilityLabel={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: t.ink,
            opacity: pressed ? 0.92 : 1,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
          <IconBag color={t.bg} size={16} />
          <View style={[styles.badge, { backgroundColor: t.terra }]}>
            <Text style={[styles.badgeText, { color: '#fff' }]}>{count}</Text>
          </View>
        </View>
        <Text style={[styles.cta, { color: t.bg }]}>Checkout</Text>
        <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.18)' }]} />
        <Text style={[styles.total, { color: t.bg }]}>{formatPrice(total, currency)}</Text>
      </Pressable>
    </View>
  );
}
