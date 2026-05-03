import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryTile from '../../components/CategoryTile';
import Chip from '../../components/Chip';
import ChipRail from '../../components/ChipRail';
import Footer from '../../components/Footer';
import HeroBanner from '../../components/HeroBanner';
import {
  IconBag,
  IconBottle,
  IconChevR,
  IconPill,
  IconStethoscope,
} from '../../components/Icons';
import Logo from '../../components/Logo';
import PrescriptionUploadCard from '../../components/PrescriptionUploadCard';
import ProductCard from '../../components/ProductCard';
import RemoteImage from '../../components/RemoteImage';
import SectionHead from '../../components/SectionHead';
import ViewToggle from '../../components/ViewToggle';
import { fragCartCount, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import HomeSearchBar from './HomeSearchBar';
import { styles } from './ShopScreen.styles';

const TOP_BRAND_LIMIT = 12;

// Pharma home: green-themed, dense product list with per-section view toggle.
// COMBOS-DISABLED-V1 — combo rail removed.
export default function ShopScreenPharma() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const isWide = bp === 'desktop' || bp === 'tablet';
  const cardCols = bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  // % per cell after subtracting (cardCols - 1) gap slots. Gap is fixed pt;
  // we let flexBasis carry the share and rely on `flexGrow: 0` so the row
  // doesn't bleed past 100%.
  const cardCellBasis = `${100 / cardCols}%`;
  const {
    cart,
    productsCache,
    categories,
    openQuickView,
    openPrescriptionSheet,
  } = useStore();
  const cartCount = fragCartCount(cart);

  const [query, setQuery] = useState('');
  const [searchedView, setSearchedView] = useState(isWide ? 'grid' : 'list');
  const [vitaminView, setVitaminView] = useState(isWide ? 'grid' : 'list');

  const all = productsCache?.all || [];
  const topBrands = useMemo(
    () =>
      [...(categories || [])]
        .sort((a, b) => (b.item || 0) - (a.item || 0))
        .slice(0, TOP_BRAND_LIMIT),
    [categories],
  );

  const tiles = useMemo(
    () => [
      {
        key: 'rx',
        label: 'Prescription Medicines',
        icon: <IconPill size={20} color={t.categoryAccentMint} />,
        bg: t.categoryMint,
        accent: t.categoryAccentMint,
        target: '/products?bucket=prescription',
      },
      {
        key: 'otc',
        label: 'OTC Medicines',
        icon: <IconPill size={20} color={t.categoryAccentSage} />,
        bg: t.categorySage,
        accent: t.categoryAccentSage,
        target: '/products?bucket=otc',
      },
      {
        key: 'vit',
        label: 'Vitamins & Supplements',
        icon: <IconBottle size={20} color={t.categoryAccentPeach} />,
        bg: t.categoryPeach,
        accent: t.categoryAccentPeach,
        target: '/products?bucket=vitamins',
      },
      {
        key: 'dev',
        label: 'Medical Devices',
        icon: <IconStethoscope size={20} color={t.categoryAccentLilac} />,
        bg: t.categoryLilac,
        accent: t.categoryAccentLilac,
        target: '/products?bucket=devices',
      },
    ],
    [t],
  );

  const wideCount = bp === 'desktop' ? 8 : bp === 'tablet' ? 6 : 6;
  const mostSearched = useMemo(
    () => sortInStockFirst(all).slice(0, wideCount),
    [all, wideCount],
  );
  const onSale = useMemo(
    () => sortInStockFirst(all.filter((p) => p.was)).slice(0, 8),
    [all],
  );
  const vitaminProducts = useMemo(() => {
    const vitaminCat = (categories || []).find((c) =>
      /vitamin|supplement/i.test(c.name || ''),
    );
    if (vitaminCat) {
      const list = productsCache?.byCategoryId?.[String(vitaminCat.id)] || [];
      if (list.length > 0) return sortInStockFirst(list).slice(0, wideCount);
    }
    return sortInStockFirst([...all].slice(-16).reverse()).slice(0, wideCount);
  }, [all, categories, productsCache, wideCount]);

  const renderRail = (products, view) => {
    if (view === 'grid') {
      const gap = 14;
      // Each cell takes `100/cols%` minus its share of the row gap, so the
      // row exactly fills the parent without leaving an empty right strip.
      const cellWidth = `calc(${100 / cardCols}% - ${(gap * (cardCols - 1)) / cardCols}px)`;
      return (
        <View style={[styles.grid, { gap }]}>
          {products.map((p) => (
            <View
              key={p.id}
              style={[
                styles.gridItem,
                Platform.OS === 'web'
                  ? { width: cellWidth, flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }
                  : { flexBasis: cardCellBasis, flexGrow: 0, flexShrink: 0, paddingRight: gap },
              ]}
            >
              <ProductCard product={p} forceLayout="editorial" />
            </View>
          ))}
        </View>
      );
    }
    return (
      <View style={{ gap: 10 }}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            forceLayout="clinical"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* Sticky header — sits above the scroll content so it stays put while
          the body scrolls. Mirrors the bottom tab bar's behavior. */}
      <View
        style={[
          styles.stickyHeader,
          {
            backgroundColor: t.bg,
            borderBottomColor: t.line,
            paddingTop: insets.top + 8,
          },
        ]}
      >
        <View style={styles.topBar}>
          <Logo />
          <View style={styles.topActions}>
            <Pressable
              onPress={() => router.push('/orders')}
              hitSlop={layout.hitSlop}
              style={[
                styles.ordersBtn,
                { backgroundColor: t.surface, borderColor: t.line },
              ]}
              accessibilityLabel="My Orders"
            >
              <IconBag color={t.ink} size={14} />
              <Text style={[styles.ordersText, { color: t.ink, fontFamily: t.fonts.sansMedium }]}>
                My Orders
              </Text>
            </Pressable>
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
          placeholder="Search medicines, health products..."
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

      <HeroBanner tenant="pharma" />

      <PrescriptionUploadCard onPress={openPrescriptionSheet} />

      {/* Categories chip rail — backend categories, capped at 12, horizontal scroll for overflow.
          react-native-web ScrollView won't scroll horizontally unless its
          flex parent is constrained; the wrapper below pins width:100% +
          overflow:hidden + minWidth:0 so the inner ScrollView clips and
          scrolls on its own. */}
      {topBrands.length > 0 ? (
        <View style={[styles.sectionWide, { paddingTop: 24 }]}>
          <ChipRail>
            {topBrands.map((c, i) => (
              <Chip
                key={c.id}
                active={i === 0}
                onPress={() => router.push(`/category/${c.id}`)}
              >
                {c.name}
              </Chip>
            ))}
          </ChipRail>
        </View>
      ) : null}

      {/* 2x2 (mobile) / 1x4 (wide) category tile grid — flex children fill the
          row exactly so there's no right-edge gap on web. */}
      <View style={[styles.section, { paddingTop: 16 }]}>
        <View style={styles.tileGrid}>
          {tiles.map((tile) => (
            <View
              key={tile.key}
              style={[
                styles.tileCell,
                isWide ? null : { flexBasis: '48%', flexGrow: 0 },
              ]}
            >
              <CategoryTile
                label={tile.label}
                icon={tile.icon}
                bg={tile.bg}
                accent={tile.accent}
                onPress={() => router.push(tile.target)}
              />
            </View>
          ))}
        </View>
      </View>

      {/* Most Searched Today */}
      <View style={styles.section}>
        <SectionHead
          title="Most Searched Today"
          action="View all"
          onAction={() => router.push('/products')}
          rightSlot={<ViewToggle value={searchedView} onChange={setSearchedView} />}
        />
        {renderRail(mostSearched, searchedView)}
      </View>

      {/* Sale rail (kept) */}
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
              <Text style={[styles.allLinkText, { color: t.terra, fontFamily: t.fonts.sans }]}>
                All deals
              </Text>
              <IconChevR color={t.terra} size={14} />
            </Pressable>
          </View>
          <View style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashRail}
            snapToInterval={162}
            decelerationRate="fast"
            style={
              Platform.OS === 'web'
                ? { overflowX: 'auto', overflowY: 'hidden', flexGrow: 0, flexShrink: 1 }
                : undefined
            }
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
        </View>
      ) : null}

      {/* Vitamins & Supplements */}
      <View style={styles.section}>
        <SectionHead
          title="Vitamins & Supplements"
          action="View all"
          onAction={() => router.push('/products')}
          rightSlot={<ViewToggle value={vitaminView} onChange={setVitaminView} />}
        />
        {renderRail(vitaminProducts, vitaminView)}
      </View>

      {/* Web-only footer (replaces the prior "Always read the label..." callout) */}
      <Footer />
      </ScrollView>
    </View>
  );
}
