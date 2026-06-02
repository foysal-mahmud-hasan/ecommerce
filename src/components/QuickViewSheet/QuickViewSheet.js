import { usePathname, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { formatPrice, percentOff } from '../../utils/format';
import { sortInStockFirst } from '../../utils/sortStock';
import QtyStepper from '../QtyStepper';
import RemoteImage from '../RemoteImage';
import { IconGrid, IconX } from '../Icons';

// Centered modal quick-view. Mounted at root layout. Driven by store.quickViewProductId.
//
// On tablet/desktop: centered card with backdrop scrim.
// On mobile: full-screen sheet (better fit for steppers + related items grid).
//
// Suppression: don't open quick-view of the same product the user is already
// viewing on the PDP — would feel redundant.
export default function QuickViewSheet() {
  const t = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { width: windowWidth } = useWindowDimensions();
  const bp = useBreakpoint();
  const isMobile = bp === 'mobile';
  const {
    quickViewProductId,
    closeQuickView,
    productsCache,
    addToCart,
    currency,
    openQuickView,
    loadProductDetail,
    loadCategoryProducts,
  } = useStore();

  const product = useMemo(() => {
    if (!quickViewProductId) return null;
    return productsCache?.byId?.[quickViewProductId] || null;
  }, [quickViewProductId, productsCache]);

  // If the user opens quick-view on a stub product (e.g. tagged-only, not yet
  // detail-fetched), pull the detail and merge it into cache.
  useEffect(() => {
    if (quickViewProductId && !product) {
      loadProductDetail(quickViewProductId);
    }
  }, [quickViewProductId, product, loadProductDetail]);

  // Lazy-load the product's category so the related-items grid has data.
  useEffect(() => {
    if (product?.categoryId) loadCategoryProducts(product.categoryId);
  }, [product?.categoryId, loadCategoryProducts]);

  const onAlreadyOnPdp = useMemo(() => {
    if (!quickViewProductId || !pathname) return false;
    return pathname.includes(`/product/${quickViewProductId}`);
  }, [quickViewProductId, pathname]);

  const visible = !!product && !onAlreadyOnPdp;

  const measurements = useMemo(() => {
    const list = Array.isArray(product?.measurements) ? product.measurements : [];
    const saleable = list.filter((m) => m.isSales !== false && m.is_sales !== 0);
    if (saleable.length > 0) return saleable.slice(0, 3);
    return [
      { unitId: 'default', label: `1 ${product?.unit || 'Unit'}`, quantity: 1 },
    ];
  }, [product]);

  const [qtyByUnit, setQtyByUnit] = useState({});
  const [relatedOpen, setRelatedOpen] = useState(false);

  // Default quantities for the current product: first unit = 1, rest 0. Reused
  // on product change and after an add (so the steppers visibly reset).
  const buildSeed = useCallback(() => {
    const seed = {};
    measurements.forEach((m, i) => {
      const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
      seed[key] = i === 0 ? 1 : 0;
    });
    return seed;
  }, [measurements]);

  useEffect(() => {
    if (!product) return;
    setQtyByUnit(buildSeed());
  }, [product, buildSeed]);

  // Collapse the related grid only on a FRESH open (modal closed→open). Within
  // the modal, swapping products keeps quickViewProductId truthy, so the grid
  // stays open and refreshes to the new product's related items.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const isOpen = !!quickViewProductId;
    if (isOpen && !wasOpenRef.current) setRelatedOpen(false);
    wasOpenRef.current = isOpen;
  }, [quickViewProductId]);

  const related = useMemo(() => {
    if (!product) return [];
    const list = productsCache?.byCategoryId?.[String(product.categoryId)] || [];
    return sortInStockFirst(list.filter((p) => p.id !== product.id), { hideOutOfStock: true }).slice(0, 12);
  }, [product, productsCache]);

  const totalQty = useMemo(
    () => Object.values(qtyByUnit).reduce((s, v) => s + (v || 0), 0),
    [qtyByUnit],
  );

  const handleAdd = useCallback(() => {
    if (!product) return;
    measurements.forEach((m, i) => {
      const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
      const q = qtyByUnit[key] || 0;
      if (q > 0) {
        addToCart(product.id, q, {
          unit: m.unitName || m.unit_name || m.label || product.unit,
          unitId: m.unitId ?? m.unit_id,
          price: product.price,
        });
      }
    });
    // Keep the modal open so the user can keep shopping (browse related items,
    // add more). addToCart already shows the "Added to cart" toast. Reset the
    // steppers to default so the row clears and a stray second press doesn't
    // silently re-add. The modal closes only on explicit close (X/backdrop).
    setQtyByUnit(buildSeed());
  }, [product, measurements, qtyByUnit, addToCart, buildSeed]);

  const handleMore = useCallback(() => {
    if (!product) return;
    // Navigate first, then close. The modal's own `onAlreadyOnPdp` guard
    // hides it on the new route, so there's no double-mount. A close-first +
    // setTimeout sequence (the previous approach) introduced a ~50ms gap
    // where the backdrop disappeared before the PDP painted — visible as a
    // flicker.
    router.push(`/product/${product.id}`);
    closeQuickView();
  }, [product, router, closeQuickView]);

  if (!product) return null;

  const discount = percentOff(product.price, product.was);
  const cardMaxWidth = isMobile ? windowWidth : Math.min(windowWidth - 48, 820);
  const cardMaxHeight = isMobile ? '88%' : '90%';
  const isStackedCard = isMobile;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isMobile ? 'slide' : 'fade'}
      onRequestClose={closeQuickView}
      statusBarTranslucent
    >
      <Pressable
        onPress={closeQuickView}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.45)',
          padding: isMobile ? 0 : 24,
          alignItems: 'center',
          justifyContent: isMobile ? 'flex-end' : 'center',
        }}
      >
        <Pressable
          onPress={() => {}}
          style={{
            width: '100%',
            maxWidth: cardMaxWidth,
            // On mobile we use a percentage maxHeight; in production Hermes
            // computes flex:1 on the child ScrollView as 0 when the parent
            // height is purely percentage-bounded. Setting an explicit
            // height alongside maxHeight gives the ScrollView a concrete
            // size to fill.
            height: isMobile ? '88%' : undefined,
            maxHeight: cardMaxHeight,
            backgroundColor: t.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: isMobile ? 0 : 20,
            borderBottomRightRadius: isMobile ? 0 : 20,
            overflow: 'hidden',
            flexDirection: 'column',
            ...(Platform.OS === 'web'
              ? { boxShadow: '0 -8px 32px rgba(0,0,0,0.18)' }
              : { elevation: 24 }),
          }}
        >
          {isMobile ? (
            <View
              pointerEvents="none"
              style={{
                alignItems: 'center',
                paddingTop: 8,
                paddingBottom: 4,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: t.line,
                }}
              />
            </View>
          ) : null}
          {/* Close button — overlays card top-right */}
          <Pressable
            onPress={closeQuickView}
            accessibilityLabel="Close"
            hitSlop={10}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: t.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <IconX size={14} color={t.ink} />
          </Pressable>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: isMobile ? 16 : 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Top row: image + info */}
            <View
              style={{
                flexDirection: isStackedCard ? 'column' : 'row',
                gap: isStackedCard ? 16 : 24,
                alignItems: isStackedCard ? 'stretch' : 'flex-start',
              }}
            >
              <View
                style={{
                  width: isStackedCard ? '100%' : '40%',
                  alignItems: isStackedCard ? 'center' : 'stretch',
                }}
              >
                <View
                  style={{
                    width: isStackedCard ? 180 : '100%',
                    height: isStackedCard ? 180 : undefined,
                    aspectRatio: isStackedCard ? undefined : 1,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: t.surfaceDeep,
                    position: 'relative',
                  }}
                >
                  <RemoteImage product={product} fit radius={14} contentFit="cover" />
                  {discount > 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: t.ink,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: t.fonts.sansSemiBold,
                          fontSize: 11,
                          color: '#FFFFFF',
                        }}
                      >
                        {discount}%
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={{ flex: 1, paddingRight: isStackedCard ? 0 : 12 }}>
                <Text
                  style={{
                    fontFamily: t.fonts.sansSemiBold,
                    fontSize: isStackedCard ? 20 : 24,
                    color: t.ink,
                    lineHeight: isStackedCard ? 26 : 30,
                    marginBottom: 8,
                  }}
                  numberOfLines={3}
                >
                  {product.name}
                </Text>
                {product.brand ? (
                  <Text
                    onPress={() => {
                      const target = product.cat || product.categoryId;
                      if (target == null) return;
                      closeQuickView();
                      router.push(`/category/${target}`);
                    }}
                    accessibilityRole="link"
                    style={{
                      fontFamily: t.fonts.sansSemiBold,
                      fontSize: 13,
                      color: t.terra,
                      marginBottom: 12,
                      textDecorationLine: 'underline',
                    }}
                    numberOfLines={2}
                  >
                    {product.brand}
                  </Text>
                ) : null}

                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                  <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink3 }}>
                    Best Price
                  </Text>
                  {product.was ? (
                    <Text
                      style={{
                        fontFamily: t.fonts.sans,
                        fontSize: 13,
                        color: t.ink3,
                        textDecorationLine: 'line-through',
                      }}
                    >
                      {formatPrice(product.was, currency)}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      fontFamily: t.fonts.sansSemiBold,
                      fontSize: 22,
                      color: t.ink,
                    }}
                  >
                    {formatPrice(product.price, currency)}
                  </Text>
                  <Text style={{ fontFamily: t.fonts.sans, fontSize: 11, color: t.ink3 }}>
                    MRP/Unit
                  </Text>
                </View>

                {/* Measurement rows — each is a bordered selection card so the
                    user can read the row as a button. Active (qty > 0) borrows
                    the same border-only selection rule as chips/tabs. */}
                <View style={{ gap: 10, marginBottom: 18 }}>
                  {measurements.map((m, i) => {
                    const key = m.unitId ?? m.unit_id ?? `idx-${i}`;
                    const qty = qtyByUnit[key] || 0;
                    const unitName = m.unitName || m.unit_name || product.unit || 'Unit';
                    const lineTotal = qty * (Number(product.price) || 0) * (Number(m.quantity) || 1);
                    const label =
                      m.label ||
                      (unitName && m.quantity
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
                        {relatedOpen ? (
                          <Text
                            style={{
                              fontFamily: t.fonts.sansSemiBold,
                              fontSize: 13,
                              color: t.terra,
                              minWidth: 60,
                              textAlign: 'right',
                            }}
                          >
                            {formatPrice(lineTotal, currency)}
                          </Text>
                        ) : null}
                      </View>
                    );
                  })}
                </View>

                {/* Delivery callout (only on wide layouts to mirror design) */}
                {!isStackedCard ? (
                  <View
                    style={{
                      backgroundColor: t.sand,
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 14,
                    }}
                  >
                    <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink2, marginBottom: 4 }}>
                      <Text style={{ fontFamily: t.fonts.sansSemiBold }}>📦 Delivery service</Text> is available all over <Text style={{ fontFamily: t.fonts.sansSemiBold }}>Bangladesh</Text>.
                    </Text>
                    <Text style={{ fontFamily: t.fonts.sans, fontSize: 12, color: t.ink2 }}>
                      ⚡ For <Text style={{ fontFamily: t.fonts.sansSemiBold }}>urgent delivery</Text> service, please contact us.
                    </Text>
                  </View>
                ) : null}

              </View>
            </View>

            {/* Related items expandable section (Phase 7) */}
            {relatedOpen ? (
              <RelatedGrid
                items={related}
                t={t}
                currency={currency}
                isMobile={isMobile}
                onAdd={(p) => {
                  addToCart(p.id, 1, { unit: p.unit, unitId: p.unitId, price: p.price });
                  // Bring the just-added product up as the one shown — "the
                  // product the user selects last." Modal stays open.
                  openQuickView(p.id);
                }}
                onOpen={(p) => openQuickView(p.id)}
              />
            ) : null}
          </ScrollView>

          {/* Sticky action bar — pinned at the bottom of the sheet so Add to
              Cart / More / Related stay reachable while the body scrolls. */}
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              padding: isMobile ? 12 : 16,
              paddingBottom: isMobile ? 16 : 16,
              borderTopWidth: 1,
              borderTopColor: t.line,
              backgroundColor: t.surface,
            }}
          >
            {/* Order: related-grid toggle · More · Add to Cart (primary, right). */}
            <Pressable
              onPress={() => setRelatedOpen((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel={relatedOpen ? 'Hide related items' : 'Show related items'}
              style={({ pressed }) => ({
                width: 44,
                height: 44,
                borderRadius: 22,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: relatedOpen ? t.terra : t.surfaceAlt,
                borderWidth: 1,
                borderColor: relatedOpen ? t.terra : t.line,
                opacity: pressed ? 0.85 : 1,
                alignSelf: 'center',
              })}
            >
              <IconGrid size={18} color={relatedOpen ? '#FFFFFF' : t.ink} />
            </Pressable>
            <Pressable
              onPress={handleMore}
              accessibilityRole="button"
              accessibilityLabel="More details"
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: t.accentOrange || '#F97316',
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: t.fonts.sansSemiBold,
                  fontSize: 14,
                  color: '#FFFFFF',
                }}
              >
                More
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              disabled={totalQty === 0}
              accessibilityRole="button"
              accessibilityLabel="Add to cart"
              style={({ pressed }) => ({
                flex: 1,
                paddingVertical: 12,
                borderRadius: 999,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: totalQty === 0 ? t.surfaceAlt : t.terra,
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: t.fonts.sansSemiBold,
                  fontSize: 14,
                  color: totalQty === 0 ? t.ink3 : '#FFFFFF',
                }}
              >
                Add to Cart
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function RelatedGrid({ items, t, currency, isMobile, onAdd, onOpen }) {
  const cols = isMobile ? 2 : 4;
  const gap = 10;
  const cellPercent = `${(100 - (cols - 1) * 2) / cols - 0.5}%`;

  if (!items.length) {
    return (
      <View style={{ marginTop: 14, padding: 16, alignItems: 'center' }}>
        <Text style={{ fontFamily: t.fonts.sans, fontSize: 13, color: t.ink3 }}>
          No related items found.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: t.line,
        paddingTop: 14,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap,
          rowGap: gap,
        }}
      >
        {items.map((p) => (
          <View
            key={p.id}
            style={{
              width: cellPercent,
              borderWidth: 1,
              borderColor: t.line,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: t.surface,
            }}
          >
            <View style={{ position: 'relative' }}>
              <View style={{ aspectRatio: 1, backgroundColor: t.surfaceDeep }}>
                <RemoteImage product={p} fit radius={0} contentFit="cover" />
              </View>
              <View
                style={{
                  position: 'absolute',
                  top: 6,
                  left: 6,
                  backgroundColor: t.terra,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 9, color: '#FFFFFF' }}>
                  OTC
                </Text>
              </View>
            </View>
            <View style={{ padding: 8, gap: 4 }}>
              <Text
                onPress={() => onOpen?.(p)}
                style={{
                  fontFamily: t.fonts.sansMedium,
                  fontSize: 12,
                  color: t.ink,
                  lineHeight: 15,
                  minHeight: 30,
                }}
                numberOfLines={2}
              >
                {p.name}
              </Text>
              <Text
                style={{ fontFamily: t.fonts.sans, fontSize: 10, color: t.ink3 }}
                numberOfLines={1}
              >
                {p.unit || '10 Tablets'}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 2,
                }}
              >
                <Text style={{ fontFamily: t.fonts.sansSemiBold, fontSize: 13, color: t.ink }}>
                  {formatPrice(p.price, currency)}
                </Text>
                <Pressable
                  onPress={() => onAdd?.(p)}
                  style={({ pressed }) => ({
                    backgroundColor: t.terra,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 999,
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text
                    style={{
                      fontFamily: t.fonts.sansSemiBold,
                      fontSize: 11,
                      color: '#FFFFFF',
                    }}
                  >
                    Add
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
