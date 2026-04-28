import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useRouter, usePathname } from 'expo-router';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import RemoteImage from '../RemoteImage';
import { styles } from './QuickViewSheet.styles';

// One global quick-view. Mounted at root layout. Driven by store.quickViewProductId.
//
// Suppression: don't open quick-view of the same product the user is already
// viewing on the PDP — would feel redundant.
export default function QuickViewSheet() {
  const t = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const {
    quickViewProductId,
    closeQuickView,
    productsCache,
    addToCart,
    currency,
  } = useStore();

  const sheetRef = useRef(null);
  const [qty, setQty] = useState(1);
  const product = useMemo(() => {
    if (!quickViewProductId) return null;
    return productsCache?.byId?.[quickViewProductId] || null;
  }, [quickViewProductId, productsCache]);

  const onAlreadyOnPdp = useMemo(() => {
    if (!quickViewProductId || !pathname) return false;
    return pathname.includes(`/product/${quickViewProductId}`);
  }, [quickViewProductId, pathname]);

  useEffect(() => {
    if (quickViewProductId && product && !onAlreadyOnPdp) {
      setQty(1);
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [quickViewProductId, product, onAlreadyOnPdp]);

  const handleDismiss = useCallback(() => {
    closeQuickView();
  }, [closeQuickView]);

  const handleAdd = useCallback(() => {
    if (!product) return;
    addToCart(product.id, qty, { unit: product.unit, unitId: product.unitId, price: product.price });
    sheetRef.current?.dismiss();
  }, [addToCart, product, qty]);

  const handleViewFull = useCallback(() => {
    if (!product) return;
    sheetRef.current?.dismiss();
    setTimeout(() => router.push(`/product/${product.id}`), 50);
  }, [product, router]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.5}
      />
    ),
    [],
  );

  const snapPoints = useMemo(() => ['85%'], []);

  if (!product) return null;

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: t.ink4 }}
      backgroundStyle={{ backgroundColor: t.bg }}
      enablePanDownToClose
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <RemoteImage product={product} fit aspectRatio={1.1} radius={18} contentFit="cover" />
        </View>

        {product.brand ? (
          <Text style={[styles.brand, { color: t.ink3, fontFamily: t.fonts.mono }]} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}
        <Text style={[styles.name, { color: t.ink, fontFamily: t.fonts.display }]} numberOfLines={2}>
          {product.name}
        </Text>
        {product.unit ? (
          <Text style={[styles.unit, { color: t.ink3, fontFamily: t.fonts.sans }]}>
            {product.unit}
          </Text>
        ) : null}

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: t.ink, fontFamily: t.fonts.sansSemiBold }]}>
            {formatPrice(product.price, currency)}
          </Text>
          {product.was ? (
            <Text style={[styles.priceWas, { color: t.ink3, fontFamily: t.fonts.sans }]}>
              {formatPrice(product.was, currency)}
            </Text>
          ) : null}
        </View>

        <View
          style={[
            styles.qtyRow,
            { borderTopColor: t.line, borderBottomColor: t.line },
          ]}
        >
          <Text style={[styles.qtyLabel, { color: t.ink2, fontFamily: t.fonts.sansMedium }]}>
            Quantity
          </Text>
          <View style={styles.qtyControls}>
            <Pressable
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              style={[styles.qtyBtn, { borderColor: t.line }]}
              hitSlop={8}
            >
              <Text style={[styles.qtyBtnText, { color: t.ink, fontFamily: t.fonts.sans }]}>−</Text>
            </Pressable>
            <Text style={[styles.qtyValue, { color: t.ink, fontFamily: t.fonts.sansSemiBold }]}>
              {qty}
            </Text>
            <Pressable
              onPress={() => setQty((q) => q + 1)}
              style={[styles.qtyBtn, { borderColor: t.line }]}
              hitSlop={8}
            >
              <Text style={[styles.qtyBtnText, { color: t.ink, fontFamily: t.fonts.sans }]}>+</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.ctaRow}>
          <Pressable
            onPress={handleAdd}
            style={[styles.primaryBtn, { backgroundColor: t.ink }]}
            accessibilityRole="button"
            accessibilityLabel="Add to cart"
          >
            <Text
              style={[styles.primaryBtnText, { color: t.bg, fontFamily: t.fonts.sansSemiBold }]}
            >
              Add to cart · {formatPrice(product.price * qty, currency)}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleViewFull}
            style={[styles.ghostBtn, { borderColor: t.line }]}
            accessibilityRole="button"
            accessibilityLabel="View full product details"
          >
            <Text style={[styles.ghostBtnText, { color: t.ink, fontFamily: t.fonts.sansMedium }]}>
              View
            </Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
