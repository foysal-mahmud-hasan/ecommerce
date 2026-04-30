import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FragButton from '../../components/FragButton';
import HeroBanner from '../../components/HeroBanner';
import { IconBag } from '../../components/Icons';
import ProductCard from '../../components/ProductCard';
import ProductCardCompact from '../../components/ProductCardCompact';
import RemoteImage from '../../components/RemoteImage';
import SectionHead from '../../components/SectionHead';
import { fragCartCount, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import HomeSearchBar from './HomeSearchBar';
import { styles } from './ShopScreen.styles';

// Restaurant home: photo-led, evocative. Hero dish + cuisine rails.
// COMBOS-DISABLED-V1 — combos hidden.
export default function ShopScreenRestaurant() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    cart,
    productsCache,
    categories,
    tenant,
    openQuickView,
  } = useStore();
  const cartCount = fragCartCount(cart);
  const bp = useBreakpoint();
  const popularCount = bp === 'desktop' ? 8 : bp === 'tablet' ? 6 : 4;
  const popularItemWidth =
    bp === 'desktop' ? '23.5%' : bp === 'tablet' ? '32%' : '48%';

  const [query, setQuery] = useState('');

  const all = productsCache?.all || [];
  const heroProduct = useMemo(() => all[0] || null, [all]);
  const popular = useMemo(
    () => sortInStockFirst(all.slice(4, 4 + popularCount)),
    [all, popularCount],
  );

  const productsByCategory = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => {
      m[c.id] = sortInStockFirst(productsCache?.byCategoryId?.[c.id] || []).slice(0, 6);
    });
    return m;
  }, [categories, productsCache]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 8, paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.season, { color: t.ink3, fontFamily: t.fonts.mono }]}>
            ESTD · TODAY
          </Text>
          <Text
            style={[
              styles.brand,
              { color: t.ink, fontFamily: t.fonts.displayItalic || t.fonts.display },
            ]}
          >
            {tenant?.name || 'Sandra Food'}
          </Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            onPress={() => router.push('/(tabs)/cart')}
            hitSlop={layout.hitSlop}
            style={[styles.topIconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Cart"
          >
            <IconBag color={t.ink} />
            {cartCount > 0 ? (
              <View style={[styles.topBadge, { backgroundColor: t.terra }]}>
                <Text style={styles.topBadgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <HomeSearchBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search dishes, cuisines"
      />

      <HeroBanner tenant="restaurant" />

      {/* Hero dish */}
      {heroProduct ? (
        <View style={styles.heroPad}>
          <View style={[styles.hero, { backgroundColor: t.surfaceDeep }]}>
            <View style={styles.heroImage}>
              <RemoteImage product={heroProduct} fit radius={0} />
            </View>
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={[styles.heroEyebrow, { fontFamily: t.fonts.mono }]}>
                CHEF'S PICK
              </Text>
              <Text
                style={[
                  styles.heroTitle,
                  { fontFamily: t.fonts.display },
                ]}
              >
                {heroProduct.name}
              </Text>
              <View style={styles.heroBtnRow}>
                <FragButton
                  size="sm"
                  variant="inkOnDark"
                  onPress={() => openQuickView(heroProduct.id)}
                >
                  Order now
                </FragButton>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* Cuisine rails */}
      {(categories || []).map((c) => {
        const items = productsByCategory[c.id] || [];
        if (!items.length) return null;
        return (
          <View key={c.id} style={styles.sectionWide}>
            <View style={styles.sectionInner}>
              <SectionHead
                eyebrow="Browse"
                title={c.name}
                action="See all"
                onAction={() => router.push(`/category/${c.id}`)}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.flashRail}
              snapToInterval={172}
              decelerationRate="fast"
            >
              {items.map((p) => (
                <ProductCardCompact
                  key={p.id}
                  product={p}
                  width={160}
                  onPress={() => openQuickView(p.id)}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}

      {/* Popular grid */}
      {popular.length > 0 ? (
        <View style={styles.section}>
          <SectionHead eyebrow="Loved" title="Popular tonight" />
          <View style={styles.grid}>
            {popular.map((p) => (
              <View
                key={p.id}
                style={[styles.gridItem, { width: popularItemWidth, flexGrow: 0 }]}
              >
                <ProductCard
                  product={p}
                  forceLayout="editorial"
                  onPress={() => openQuickView(p.id)}
                  onLongPress={() => router.push(`/product/${p.id}`)}
                />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* House callout */}
      <View style={styles.section}>
        <View style={[styles.callout, { backgroundColor: t.ink }]}>
          <Text style={[styles.calloutEyebrow, { color: t.ink3, fontFamily: t.fonts.mono }]}>
            HOUSE NOTE
          </Text>
          <Text style={[styles.calloutTitle, { color: t.bg, fontFamily: t.fonts.display }]}>
            Cooked fresh, brought warm.
          </Text>
          <View style={styles.calloutBtnRow}>
            <FragButton size="sm" variant="ghostOnDark">
              Today's menu
            </FragButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
