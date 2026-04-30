import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import HeroBanner from '../../components/HeroBanner';
import { IconBag, IconChevR } from '../../components/Icons';
import PrescriptionUploadCard from '../../components/PrescriptionUploadCard';
import ProductCard from '../../components/ProductCard';
import RemoteImage from '../../components/RemoteImage';
import SectionHead from '../../components/SectionHead';
import { fragCartCount, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import HomeSearchBar from './HomeSearchBar';
import { styles } from './ShopScreen.styles';

const TOP_BRAND_LIMIT = 30;

// Pharma home: info-dense, photos optional. Top-brand rail + product rails.
// COMBOS-DISABLED-V1 — combo rail removed.
export default function ShopScreenPharma() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const isWide = bp === 'desktop' || bp === 'tablet';
  // Match the catalog grid: 4 cols desktop, 3 cols tablet. 2 cols on a 1280pt
  // canvas makes each card ~600pt wide which feels oversized.
  const gridItemWidth = bp === 'desktop' ? '23.5%' : bp === 'tablet' ? '32%' : '48%';
  const {
    cart,
    productsCache,
    categories,
    tenant,
    openQuickView,
    openPrescriptionSheet,
  } = useStore();
  const cartCount = fragCartCount(cart);

  const [query, setQuery] = useState('');

  const all = productsCache?.all || [];
  const topBrands = useMemo(
    () =>
      [...(categories || [])]
        .sort((a, b) => (b.item || 0) - (a.item || 0))
        .slice(0, TOP_BRAND_LIMIT),
    [categories],
  );
  // On wide layouts 4 cols × 2 rows = 8, 3 cols × 2 rows = 6.
  // Mobile list is dense, so 6 stays comfortable. Pick a per-bp count.
  const wideCount = bp === 'desktop' ? 8 : bp === 'tablet' ? 6 : 6;
  const featured = useMemo(() => sortInStockFirst(all).slice(0, wideCount), [all, wideCount]);
  const onSale = useMemo(
    () => sortInStockFirst(all.filter((p) => p.was)).slice(0, 8),
    [all],
  );
  const newest = useMemo(
    () => sortInStockFirst([...all].slice(-16).reverse()).slice(0, wideCount),
    [all, wideCount],
  );

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
          <Text style={[styles.season, { color: t.ink3, fontFamily: t.fonts.mono }]}>PHARMACY</Text>
          <Text style={[styles.brand, { color: t.ink, fontFamily: t.fonts.display }]}>
            {tenant?.name || 'Store'}
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

      {/* Inline search — replaces the old "search shortcut" Pressable */}
      <HomeSearchBar
        query={query}
        onQueryChange={setQuery}
        placeholder="Search medicines, brands, devices"
      />

      {/* Home content stays visible underneath the search dropdown so the
          user feels like they opened a menu, not navigated to a new page. */}
      <HeroBanner tenant="pharma" />

          <PrescriptionUploadCard onPress={openPrescriptionSheet} />

          {/* Top brands — 30 chips horizontal scroll, "View all" trailing */}
          <View style={[styles.sectionWide, { paddingTop: 28 }]}>
            <View style={styles.sectionInner}>
              <SectionHead
                eyebrow="Shop by"
                title="Top brands"
                action="All"
                onAction={() => router.push('/products')}
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              {topBrands.map((c) => (
                <Chip key={c.id} onPress={() => router.push(`/category/${c.id}`)}>
                  {c.name}
                </Chip>
              ))}
              <Chip onPress={() => router.push('/products')} active>
                View all →
              </Chip>
            </ScrollView>
          </View>

          {/* Featured — 4-col (desktop) / 3-col (tablet) editorial grid on web,
              vertical clinical list on mobile */}
          <View style={styles.section}>
            <SectionHead
              eyebrow="Right now"
              title="Featured"
              action="See all"
              onAction={() => router.push('/products')}
            />
            {isWide ? (
              <View style={styles.grid}>
                {featured.map((p) => (
                  <View key={p.id} style={[styles.gridItem, { width: gridItemWidth, flexGrow: 0 }]}>
                    <ProductCard
                      product={p}
                      forceLayout="editorial"
                      onPress={() => openQuickView(p.id)}
                      onLongPress={() => router.push(`/product/${p.id}`)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {featured.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onPress={() => openQuickView(p.id)}
                    onLongPress={() => router.push(`/product/${p.id}`)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Sale rail */}
          {onSale.length > 0 ? (
            <View style={styles.sectionWide}>
              <View style={[styles.sectionInner, styles.flashHeader]}>
                <View>
                  <Text style={[styles.flashEyebrow, { color: t.sale, fontFamily: t.fonts.mono }]}>
                    LIMITED TIME
                  </Text>
                  <Text style={[styles.flashTitle, { color: t.ink, fontFamily: t.fonts.display }]}>
                    On sale
                  </Text>
                </View>
                <Pressable
                  hitSlop={layout.hitSlop}
                  style={styles.allLink}
                  onPress={() => router.push('/products')}
                >
                  <Text style={[styles.allLinkText, { color: t.ink2, fontFamily: t.fonts.sans }]}>
                    All deals
                  </Text>
                  <IconChevR color={t.ink2} size={14} />
                </Pressable>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flashRail}
                snapToInterval={162}
                decelerationRate="fast"
              >
                {onSale.map((p) => (
                  <View key={p.id} style={{ width: 150 }}>
                    <View style={{ aspectRatio: 1, borderRadius: 8, overflow: 'hidden' }}>
                      <RemoteImage product={p} fit radius={8} />
                    </View>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontFamily: t.fonts.sansMedium,
                        fontSize: 13,
                        color: t.ink,
                        marginTop: 8,
                      }}
                    >
                      {p.name}
                    </Text>
                    <Pressable onPress={() => openQuickView(p.id)} style={{ marginTop: 6 }}>
                      <Text
                        style={{
                          fontFamily: t.fonts.sansSemiBold,
                          fontSize: 12,
                          color: t.terra,
                        }}
                      >
                        Add quick →
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}

          {/* New arrivals */}
          <View style={styles.section}>
            <SectionHead
              eyebrow="Just in"
              title="New arrivals"
              action="See all"
              onAction={() => router.push('/products')}
            />
            {isWide ? (
              <View style={styles.grid}>
                {newest.map((p) => (
                  <View key={p.id} style={[styles.gridItem, { width: gridItemWidth, flexGrow: 0 }]}>
                    <ProductCard
                      product={p}
                      forceLayout="editorial"
                      onPress={() => openQuickView(p.id)}
                      onLongPress={() => router.push(`/product/${p.id}`)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                {newest.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onPress={() => openQuickView(p.id)}
                    onLongPress={() => router.push(`/product/${p.id}`)}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Notice block */}
          <View style={styles.section}>
            <View style={[styles.callout, { backgroundColor: t.ink }]}>
              <Text style={[styles.calloutEyebrow, { color: t.ink3, fontFamily: t.fonts.mono }]}>
                HEALTH NOTE
              </Text>
              <Text style={[styles.calloutTitle, { color: t.bg, fontFamily: t.fonts.display }]}>
                Always read the label and follow your prescription.
              </Text>
            </View>
          </View>
    </ScrollView>
  );
}
