import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../../components/Badge';
import FragButton from '../../components/FragButton';
import {
  IconChevL,
  IconHeart,
  IconShield,
  IconSpark,
  IconTruck,
} from '../../components/Icons';
import Price from '../../components/Price';
import ProductCardCompact from '../../components/ProductCardCompact';
import RemoteImage from '../../components/RemoteImage';
import Rating from '../../components/Rating';
import SectionHead from '../../components/SectionHead';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice, percentOff } from '../../utils/format';
import { useBreakpoint } from '../../utils/responsive';
import { styles } from './ProductScreen.styles';

const PERKS = [
  ['truck', 'Fast delivery'],
  ['shield', 'Secure checkout'],
  ['spark', 'Verified seller'],
];

function PerkIcon({ name, color }) {
  if (name === 'truck') return <IconTruck color={color} size={14} />;
  if (name === 'shield') return <IconShield color={color} size={14} />;
  return <IconSpark color={color} size={14} />;
}

export default function ProductScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const isDesktop = bp === 'desktop';
  const { id } = useLocalSearchParams();
  const productId = typeof id === 'string' ? id : '';
  const { productsCache, wishlist, toggleWishlist, addToCart, currency, openQuickView } = useStore();
  const product = productsCache?.byId?.[productId];

  const saleableMeasurements = useMemo(
    () => (product?.measurements || []).filter((m) => m.is_sales === 1),
    [product],
  );

  const [selectedUnitId, setSelectedUnitId] = useState(
    () =>
      saleableMeasurements.find((m) => m.is_base_unit === 1)?.unit_id ||
      saleableMeasurements[0]?.unit_id ||
      product?.unitId ||
      null,
  );

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontFamily: t.fonts.sans, color: t.ink3 }}>Product not found.</Text>
      </View>
    );
  }

  const saved = wishlist.includes(product.id);
  const discount = percentOff(product.price, product.was);
  const related = useMemo(
    () =>
      (productsCache?.byCategoryId?.[String(product.categoryId)] || [])
        .filter((p) => p.id !== product.id)
        .slice(0, 8),
    [productsCache, product],
  );

  const onAdd = () => {
    addToCart(product.id, 1, { unitId: selectedUnitId, unit: product.unit, price: product.price });
  };
  const onBuy = () => {
    onAdd();
    router.push('/checkout');
  };

  // Gallery as a standalone block — used both in mobile (top of scroll) and
  // desktop (left column).
  const Gallery = (
    <View style={styles.galleryWrap}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={layout.hitSlop}
        style={[styles.fab, { top: insets.top + 6, left: 16, backgroundColor: t.glass }]}
        accessibilityLabel="Back"
      >
        <IconChevL color={t.ink} size={16} />
      </Pressable>
      <Pressable
        onPress={() => toggleWishlist(product.id)}
        hitSlop={layout.hitSlop}
        style={[styles.fab, { top: insets.top + 6, right: 16, backgroundColor: t.glass }]}
        accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <IconHeart color={saved ? t.terra : t.ink} size={17} filled={saved} />
      </Pressable>
      <View
        style={[
          styles.galleryImage,
          { backgroundColor: t.surfaceDeep },
          isDesktop && { aspectRatio: 1 },
        ]}
      >
        <RemoteImage
          product={product}
          aspectRatio={isDesktop ? 1 : 0.85}
          radius={0}
          contentFit="cover"
        />
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: t.bg },
        isDesktop && { flexDirection: 'row' },
      ]}
    >
      {isDesktop ? <View style={{ flex: 1, maxWidth: '55%' }}>{Gallery}</View> : null}
      <View style={isDesktop ? { flex: 1, minWidth: 380 } : { flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + layout.buyBarHeight + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {!isDesktop ? Gallery : null}

        <View style={styles.info}>
          {product.brand ? (
            <Text style={[styles.brand, { color: t.ink3 }]}>{product.brand}</Text>
          ) : null}
          <Text style={[styles.name, { color: t.ink }]}>{product.name}</Text>
          {t.showProductRating ? (
            <View style={styles.metaRow}>
              <Rating value={product.rating} reviews={product.reviews} size={13} />
            </View>
          ) : null}
          <View style={styles.priceRow}>
            <Price price={product.price} was={product.was} size={22} />
            {discount > 0 ? <Badge tone="sale">-{discount}%</Badge> : null}
          </View>

          <View style={[styles.aboutBlock, { borderColor: t.line }]}>
            <Text style={[styles.eyebrow, { color: t.ink3 }]}>ABOUT</Text>
            <Text style={[styles.aboutText, { color: t.ink2 }]}>
              {product.description || `${product.name} from ${product.brand || 'our shelves'}.`}
            </Text>
            <View style={styles.perkRow}>
              {PERKS.map(([name, label]) => (
                <View key={name} style={styles.perkItem}>
                  <PerkIcon name={name} color={t.ink3} />
                  <Text style={[styles.perkText, { color: t.ink3 }]}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {saleableMeasurements.length > 1 ? (
            <View style={styles.variantBlock}>
              <View style={styles.variantHead}>
                <Text style={[styles.eyebrow, { color: t.ink3 }]}>UNIT</Text>
              </View>
              <View style={styles.sizeRow}>
                {saleableMeasurements.map((m) => {
                  const active = selectedUnitId === m.unit_id;
                  return (
                    <Pressable
                      key={m.unit_id}
                      onPress={() => setSelectedUnitId(m.unit_id)}
                      hitSlop={layout.hitSlop}
                      style={[
                        styles.sizeCell,
                        {
                          backgroundColor: active ? t.ink : 'transparent',
                          borderColor: active ? t.ink : t.line,
                          paddingHorizontal: 14,
                          minWidth: 64,
                        },
                      ]}
                    >
                      <Text style={[styles.sizeText, { color: active ? t.bg : t.ink }]}>
                        {m.unit_name}
                      </Text>
                      {m.quantity > 1 ? (
                        <Text
                          style={{
                            color: active ? t.bg : t.ink3,
                            fontFamily: t.fonts.mono,
                            fontSize: 9,
                            marginTop: 2,
                          }}
                        >
                          ×{m.quantity}
                        </Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          {/* COMBOS-DISABLED-V1 — combo cross-sell hidden while combos are disabled.
          {matchingCombo ? (
            <View style={styles.comboBlock}>
              <Text style={[styles.eyebrow, { color: t.ink3, marginBottom: 10 }]}>
                COMPLETE THE SET
              </Text>
              <ComboCard combo={matchingCombo} layout="flatlay" onPress={() => router.push(`/combo/${matchingCombo.id}`)} />
            </View>
          ) : null}
          */}

          {related.length > 0 ? (
            <>
              <SectionHead eyebrow="You may also like" title="Pairs with" />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedRail}
              >
                {related.map((r) => (
                  <ProductCardCompact
                    key={r.id}
                    product={r}
                    width={140}
                    onPress={() => openQuickView(r.id)}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.buyBar,
          {
            backgroundColor: t.bg,
            borderTopColor: t.line,
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <View style={styles.addBtn}>
          <FragButton variant="ghost" size="md" onPress={onAdd}>
            Add to bag
          </FragButton>
        </View>
        <View style={styles.buyBtn}>
          <FragButton variant="primary" size="md" onPress={onBuy} full>
            {`Buy now · ${formatPrice(product.price, currency)}`}
          </FragButton>
        </View>
      </View>
      </View>
    </View>
  );
}
