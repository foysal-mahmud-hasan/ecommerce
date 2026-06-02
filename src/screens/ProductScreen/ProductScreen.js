import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../../components/Badge';
import Footer from '../../components/Footer';
import {
  IconChevL,
  IconHeart,
  IconShield,
  IconSpark,
  IconTruck,
} from '../../components/Icons';
import ProductCardCompact from '../../components/ProductCardCompact';
import QtyStepper from '../../components/QtyStepper';
import RemoteImage from '../../components/RemoteImage';
import SectionHead from '../../components/SectionHead';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice, percentOff } from '../../utils/format';
import { useBreakpoint, useIsWebWide } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import { styles } from './ProductScreen.styles';

const PERKS = [
  { id: 'truck', label: 'Fast delivery', Icon: IconTruck },
  { id: 'shield', label: 'Secure checkout', Icon: IconShield },
  { id: 'spark', label: 'Verified seller', Icon: IconSpark },
];

export default function ProductScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const isWide = bp === 'desktop' || bp === 'tablet';
  const webWide = useIsWebWide();
  const { id } = useLocalSearchParams();
  const productId = typeof id === 'string' ? id : '';
  const {
    productsCache,
    wishlist,
    toggleWishlist,
    addToCart,
    currency,
    openQuickView,
    loadProductDetail,
    loadCategoryProducts,
    detailStatus,
  } = useStore();
  const product = productsCache?.byId?.[productId];

  // If we don't have this product cached, fetch its detail. Idempotent.
  useEffect(() => {
    if (productId && !product) loadProductDetail(productId);
  }, [productId, product, loadProductDetail]);

  // Once product is loaded, lazy-load its category so related items appear.
  useEffect(() => {
    if (product?.categoryId) loadCategoryProducts(product.categoryId);
  }, [product?.categoryId, loadCategoryProducts]);

  const measurements = useMemo(() => {
    const list = Array.isArray(product?.measurements) ? product.measurements : [];
    // Normalized shape has {isSales:boolean}; raw shape used 1/0 — accept both
    // so this works against either source.
    const saleable = list.filter((m) => m.isSales !== false && m.is_sales !== 0);
    if (saleable.length > 0) return saleable;
    return [
      {
        unitId: 'default',
        unitName: product?.unit || 'Unit',
        quantity: 1,
        label: `1 ${product?.unit || 'Unit'}`,
      },
    ];
  }, [product]);

  const [qtyByUnit, setQtyByUnit] = useState({});

  useEffect(() => {
    if (!product) return;
    const seed = {};
    measurements.forEach((m, i) => {
      const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
      seed[key] = i === 0 ? 1 : 0;
    });
    setQtyByUnit(seed);
  }, [product, measurements]);

  const related = useMemo(() => {
    if (!product) return [];
    const list = productsCache?.byCategoryId?.[String(product.categoryId)] || [];
    return sortInStockFirst(list.filter((p) => p.id !== product.id), { hideOutOfStock: true }).slice(0, 8);
  }, [product, productsCache]);

  if (!product) {
    const detailLoadState = detailStatus?.[productId] || 'idle';
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        {detailLoadState === 'loading' || detailLoadState === 'idle' ? (
          <ActivityIndicator color={t.terra} />
        ) : (
          <Text style={{ fontFamily: t.fonts.sans, color: t.ink3 }}>Product not found.</Text>
        )}
      </View>
    );
  }

  const saved = wishlist.includes(product.id);
  const discount = percentOff(product.price, product.was);
  const totalQty = Object.values(qtyByUnit).reduce((s, v) => s + (v || 0), 0);
  const subtotal = measurements.reduce((s, m, i) => {
    const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
    const q = qtyByUnit[key] || 0;
    return s + q * (Number(product.price) || 0) * (Number(m.quantity) || 1);
  }, 0);

  const handleAdd = () => {
    if (totalQty === 0) {
      addToCart(product.id, 1, { unit: product.unit, unitId: product.unitId, price: product.price });
      return;
    }
    measurements.forEach((m, i) => {
      const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
      const q = qtyByUnit[key] || 0;
      if (q > 0) {
        addToCart(product.id, q, {
          unit: m.unitName || m.unit_name || product.unit,
          unitId: m.unitId ?? m.unit_id,
          price: product.price,
        });
      }
    });
  };

  const handleBuy = () => {
    handleAdd();
    router.push('/checkout');
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + layout.buyBarHeight + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar inside scroll so it scrolls away on mobile. On desktop the
            global top nav handles navigation, so the back button is hidden and
            only the wishlist toggle remains (right-aligned). */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingTop: webWide ? 16 : insets.top + 8,
            paddingBottom: 8,
            maxWidth: webWide ? 1120 : undefined,
            alignSelf: webWide ? 'center' : undefined,
            width: '100%',
          }}
        >
          {webWide ? (
            <View />
          ) : (
            <Pressable
              onPress={() => router.back()}
              hitSlop={layout.hitSlop}
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t.surface,
                borderWidth: 1,
                borderColor: t.line,
              }}
              accessibilityLabel="Back"
            >
              <IconChevL color={t.ink} size={16} />
            </Pressable>
          )}
          <Pressable
            onPress={() => toggleWishlist(product.id)}
            hitSlop={layout.hitSlop}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.surface,
              borderWidth: 1,
              borderColor: t.line,
            }}
            accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <IconHeart color={saved ? t.terra : t.ink} size={17} filled={saved} />
          </Pressable>
        </View>

        {/* Two-column on desktop, stacked on mobile */}
        <View
          style={{
            flexDirection: isWide ? 'row' : 'column',
            gap: isWide ? 32 : 16,
            paddingHorizontal: 16,
            alignItems: 'flex-start',
            maxWidth: webWide ? 1120 : undefined,
            alignSelf: webWide ? 'center' : undefined,
            width: '100%',
          }}
        >
          {/* IMAGE */}
          <View
            style={{
              width: isWide ? '45%' : '100%',
              maxWidth: isWide ? 480 : undefined,
              position: 'relative',
            }}
          >
            <View
              style={{
                aspectRatio: 1,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: t.surfaceDeep,
              }}
            >
              <RemoteImage product={product} fit radius={16} contentFit="cover" />
            </View>
            {discount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: t.ink,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 11, color: '#FFFFFF' }}>
                  {discount}%
                </Text>
              </View>
            ) : null}
          </View>

          {/* DETAILS */}
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              style={{
                fontFamily: t.fonts.sansSemiBold,
                fontSize: isWide ? 28 : 22,
                lineHeight: isWide ? 34 : 28,
                color: t.ink,
                marginBottom: 8,
              }}
            >
              {product.name}
            </Text>
            {product.brand ? (
              <Text
                onPress={() => {
                  const target = product.cat || product.categoryId;
                  if (target == null) return;
                  router.push(`/category/${target}`);
                }}
                accessibilityRole="link"
                style={{
                  fontFamily: t.fonts.sansSemiBold,
                  fontSize: 13,
                  color: t.terra,
                  marginBottom: 14,
                  textDecorationLine: 'underline',
                }}
              >
                {product.brand}
              </Text>
            ) : null}

            {/* Price */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink3 }}>Best Price</Text>
              {product.was ? (
                <Text style={{ fontFamily: t.fonts.sans, fontSize: 14, color: t.ink3, textDecorationLine: 'line-through' }}>
                  {formatPrice(product.was, currency)}
                </Text>
              ) : null}
              <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 24, color: t.ink }}>
                {formatPrice(product.price, currency)}
              </Text>
              <Text style={{ fontFamily: t.fonts.sans, fontSize: 11, color: t.ink3 }}>MRP/Unit</Text>
              {discount > 0 ? <Badge tone="sale">{discount}% OFF</Badge> : null}
            </View>

            {/* Measurement steppers */}
            <View
              style={{
                gap: 12,
                marginBottom: 18,
                paddingVertical: 16,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: t.line,
                backgroundColor: t.surface,
              }}
            >
              <Text style={{ fontFamily: t.fonts.mono, fontSize: 10, letterSpacing: 1.4, color: t.ink3 }}>
                CHOOSE QUANTITY
              </Text>
              {measurements.map((m, i) => {
                const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
                const qty = qtyByUnit[key] || 0;
                const unitName = m.unitName || m.unit_name || product.unit || 'Unit';
                const lineTotal = qty * (Number(product.price) || 0) * (Number(m.quantity) || 1);
                const label =
                  m.label ||
                  (unitName && m.quantity > 1
                    ? `1 ${unitName} = ${m.quantity} Pcs`
                    : unitName || `1 ${product.unit || 'Unit'}`);
                const selected = qty > 0;
                return (
                  <View
                    key={key}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      borderWidth: selected ? 1.5 : 1,
                      borderColor: selected ? t.terra : t.line,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: selected ? t.fonts.sansSemiBold : t.fonts.sans,
                        fontSize: 13,
                        color: selected ? t.terra : t.ink2,
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {label}
                    </Text>
                    <QtyStepper
                      value={qty}
                      onChange={(v) => setQtyByUnit((prev) => ({ ...prev, [key]: v }))}
                      min={0}
                      size="compact"
                    />
                    <Text
                      style={{
                        fontFamily: t.fonts.sansSemiBold,
                        fontSize: 13,
                        color: selected ? t.terra : t.ink3,
                        minWidth: 60,
                        textAlign: 'right',
                      }}
                    >
                      {formatPrice(lineTotal, currency)}
                    </Text>
                  </View>
                );
              })}
              {totalQty > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: t.line,
                  }}
                >
                  <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 13, color: t.ink }}>
                    Subtotal · {totalQty} {totalQty === 1 ? 'item' : 'items'}
                  </Text>
                  <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 14, color: t.terra }}>
                    {formatPrice(subtotal, currency)}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Inline CTAs on desktop (the sticky bottom buy bar is mobile-only) */}
            {webWide ? (
              <View style={{ flexDirection: 'row', gap: 12, marginBottom: 18 }}>
                <Pressable
                  onPress={handleAdd}
                  style={({ pressed }) => ({
                    flex: 1,
                    height: 50,
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: t.terra,
                    backgroundColor: 'transparent',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 15, color: t.terra }}>
                    Add to Cart
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleBuy}
                  style={({ pressed }) => ({
                    flex: 1.4,
                    height: 50,
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: t.terra,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 15, color: '#FFFFFF' }}>
                    Buy now · {formatPrice(subtotal > 0 ? subtotal : product.price, currency)}
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* Delivery callout (matches design language) */}
            <View
              style={{
                backgroundColor: t.sand,
                borderRadius: 10,
                padding: 12,
                marginBottom: 18,
              }}
            >
              <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink2, marginBottom: 4 }}>
                <Text style={{ fontFamily: t.fonts.sansSemiBold }}>📦 Delivery service</Text> is available all over <Text style={{ fontFamily: t.fonts.sansSemiBold }}>Bangladesh</Text>.
              </Text>
              <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink2 }}>
                ⚡ For <Text style={{ fontFamily: t.fonts.sansSemiBold }}>urgent delivery</Text> service, please contact us.
              </Text>
            </View>

            {/* About */}
            <View style={{ paddingVertical: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: t.line, marginBottom: 18 }}>
              <Text style={{ fontFamily: t.fonts.mono, fontSize: 10, letterSpacing: 1.4, color: t.ink3, marginBottom: 10 }}>
                ABOUT
              </Text>
              <Text style={{ fontFamily: t.fonts.sans, fontSize: 14, lineHeight: 21, color: t.ink2 }}>
                {product.description || `${product.name} from ${product.brand || 'our shelves'}.`}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 14 }}>
                {PERKS.map(({ id: pid, label, Icon }) => (
                  <View key={pid} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon color={t.terra} size={14} />
                    <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink3 }}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Related */}
        {related.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            <SectionHead title="Related items" eyebrow="You may also like" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
              style={{ overflow: 'visible' }}
            >
              {related.map((r) => (
                <ProductCardCompact
                  key={r.id}
                  product={r}
                  width={150}
                  onPress={() => {
                    const saleable = Array.isArray(r.measurements)
                      ? r.measurements.filter((m) => m.isSales !== false && m.is_sales !== 0)
                      : [];
                    if (saleable.length > 1) {
                      openQuickView(r.id);
                    } else {
                      router.push(`/product/${r.id}`);
                    }
                  }}
                />
              ))}
            </ScrollView>
          </View>
        ) : null}

        <Footer />
      </ScrollView>

      {/* Sticky buy bar — mobile only; desktop uses the inline CTAs above */}
      {webWide ? null : (
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: 'row',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 12 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: t.line,
          backgroundColor: t.bg,
        }}
      >
        <Pressable
          onPress={handleAdd}
          style={({ pressed }) => ({
            flex: 1,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: t.terra,
            backgroundColor: 'transparent',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 14, color: t.terra }}>
            Add to Cart
          </Text>
        </Pressable>
        <Pressable
          onPress={handleBuy}
          style={({ pressed }) => ({
            flex: 1.4,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: t.terra,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 14, color: '#FFFFFF' }}>
            Buy now · {formatPrice(subtotal > 0 ? subtotal : product.price, currency)}
          </Text>
        </Pressable>
      </View>
      )}
    </View>
  );
}
