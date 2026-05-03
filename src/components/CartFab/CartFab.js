import { usePathname } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, Platform, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fragCartCount, fragCartTotal, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { IconBag, IconX } from '../Icons';
import { styles } from './CartFab.styles';

// Routes where the FAB should be hidden:
function isSuppressedPath(pathname) {
  if (!pathname) return false;
  if (pathname.startsWith('/(auth)')) return true;
  if (pathname.startsWith('/checkout')) return true;
  if (pathname.startsWith('/tenant-switch')) return true;
  if (pathname.startsWith('/(tabs)/cart')) return true;
  if (pathname === '/cart') return true;
  return false;
}

function pathHasTabBar(pathname) {
  if (!pathname) return false;
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
  const { width: winW, height: winH } = useWindowDimensions();
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

  // Dismiss state: hidden until the cart count changes again.
  const [dismissedAtCount, setDismissedAtCount] = useState(null);

  useEffect(() => {
    if (dismissedAtCount !== null && count !== dismissedAtCount) {
      setDismissedAtCount(null);
    }
  }, [count, dismissedAtCount]);

  // Drag position. Animated.ValueXY persists between renders. Initial offset
  // is bottom-right corner; user can drag anywhere on screen.
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const lastOffset = useRef({ x: 0, y: 0 });
  const draggedRef = useRef(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Only start panning after a small movement so taps still fire.
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 4 || Math.abs(g.dy) > 4,
        onPanResponderGrant: () => {
          draggedRef.current = false;
          pan.setOffset({ x: lastOffset.current.x, y: lastOffset.current.y });
          pan.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: (_, g) => {
          draggedRef.current = true;
          pan.x.setValue(g.dx);
          pan.y.setValue(g.dy);
        },
        onPanResponderRelease: () => {
          pan.flattenOffset();
          lastOffset.current = { x: pan.x.__getValue(), y: pan.y.__getValue() };
        },
      }),
    [pan],
  );

  const baseBottom = useMemo(() => {
    const base = (insets.bottom || 0) + 16;
    return pathHasTabBar(pathname) ? base + layout.tabBarHeight : base;
  }, [insets.bottom, pathname]);

  const hidden =
    count === 0 ||
    isSuppressedPath(pathname) ||
    cartSheetOpen ||
    prescriptionSheetOpen ||
    quickViewProductId != null ||
    dismissedAtCount === count;

  const handlePress = useCallback(() => {
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    openCartSheet();
  }, [openCartSheet]);

  if (hidden) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.wrap,
        {
          bottom: baseBottom,
          right: 16,
          transform: pan.getTranslateTransform(),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: t.ink, opacity: pressed ? 0.92 : 1 },
            Platform.OS === 'web' ? { cursor: 'grab' } : null,
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
        <Pressable
          onPress={() => setDismissedAtCount(count)}
          accessibilityLabel="Dismiss cart shortcut"
          hitSlop={6}
          style={({ pressed }) => ({
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: t.surface,
            borderWidth: 1,
            borderColor: t.line,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <IconX color={t.ink} size={12} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
