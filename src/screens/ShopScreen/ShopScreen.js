import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../../components/Badge';
import Chip from '../../components/Chip';
import ComboCard from '../../components/ComboCard';
import FragButton from '../../components/FragButton';
import { IconBag, IconChevR, IconSearch } from '../../components/Icons';
import ProductCard from '../../components/ProductCard';
import ProductCardCompact from '../../components/ProductCardCompact';
import ProductImage from '../../components/ProductImage';
import Rating from '../../components/Rating';
import SectionHead from '../../components/SectionHead';
import Price from '../../components/Price';
import { fragCombos } from '../../data/combos';
import { fragCategories, fragTags } from '../../data/categories';
import { fragProducts, fragProductMap } from '../../data/products';
import { fragCartCount, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { styles } from './ShopScreen.styles';

const featuredIds = ['p1', 'p2', 'p3', 'p4'];
const newArrivalIds = ['p7', 'p8', 'p9', 'p10'];
const bestSellerIds = ['p1', 'p4', 'p11', 'p5'];

export default function ShopScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, comboLayout } = useStore();
  const cartCount = fragCartCount(cart);
  const heroProduct = fragProductMap.p4;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: t.bg }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 8, paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={[styles.season, { color: t.ink3 }]}>SS · 26</Text>
          <Text style={[styles.brand, { color: t.ink }]}>Fragouras</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable
            onPress={() => router.push('/(tabs)/search')}
            hitSlop={layout.hitSlop}
            style={[styles.topIconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Search"
          >
            <IconSearch color={t.ink} />
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

      {/* Hero */}
      <View style={styles.heroPad}>
        <View style={[styles.hero, { backgroundColor: t.surfaceDeep }]}>
          <View style={styles.heroImage}>
            <ProductImage product={heroProduct} fit radius={0} />
          </View>
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>THE QUIET SEASON</Text>
            <Text style={styles.heroTitle}>Soft edges,</Text>
            <Text style={styles.heroTitleItalic}>soft ends.</Text>
            <View style={styles.heroBtnRow}>
              <FragButton
                size="sm"
                variant="inkOnDark"
                onPress={() => router.push('/category/apparel')}
              >
                Shop the collection
              </FragButton>
            </View>
          </View>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <SectionHead eyebrow="Shop by" title="Categories" />
        <View style={styles.categoryGrid}>
          {fragCategories.map((c) => {
            const sample = fragProducts.find((p) => p.cat === c.id);
            return (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/category/${c.id}`)}
                style={styles.categoryCell}
              >
                <View style={styles.categoryImage}>
                  <ProductImage product={sample} aspectRatio={1} radius={12} />
                </View>
                <Text style={[styles.categoryLabel, { color: t.ink }]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Combos carousel */}
      <View style={styles.sectionWide}>
        <View style={styles.sectionInner}>
          <SectionHead
            eyebrow="Curated sets"
            title="The Combos"
            action="All sets"
            onAction={() => router.push('/category/combos')}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.comboRail}
        >
          {fragCombos.map((c) => (
            <View key={c.id} style={styles.comboCardWrap}>
              <ComboCard
                combo={c}
                layout={comboLayout}
                onPress={() => router.push(`/combo/${c.id}`)}
                visualHeight={240}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Featured grid */}
      <View style={styles.section}>
        <SectionHead
          eyebrow="This week"
          title="Featured"
          action="See all"
          onAction={() => router.push('/category/apparel')}
        />
        <View style={styles.grid}>
          {featuredIds.map((id) => {
            const p = fragProductMap[id];
            return (
              <View key={id} style={styles.gridItem}>
                <ProductCard product={p} onPress={() => router.push(`/product/${id}`)} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Flash sale rail */}
      <View style={styles.sectionWide}>
        <View style={[styles.sectionInner, styles.flashHeader]}>
          <View>
            <Text style={[styles.flashEyebrow, { color: t.sale }]}>ENDS IN 02:41:16</Text>
            <Text style={[styles.flashTitle, { color: t.ink }]}>Flash sale</Text>
          </View>
          <Pressable hitSlop={layout.hitSlop} style={styles.allLink}>
            <Text style={[styles.allLinkText, { color: t.ink2 }]}>All deals</Text>
            <IconChevR color={t.ink2} size={14} />
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flashRail}
        >
          {fragProducts
            .filter((p) => p.was)
            .map((p) => (
              <ProductCardCompact
                key={p.id}
                product={p}
                width={150}
                onPress={() => router.push(`/product/${p.id}`)}
              />
            ))}
        </ScrollView>
      </View>

      {/* Bestsellers list */}
      <View style={styles.section}>
        <SectionHead eyebrow="Top sales" title="Bestsellers" />
        <View style={styles.bestList}>
          {bestSellerIds.map((id, i) => {
            const p = fragProductMap[id];
            return (
              <Pressable
                key={id}
                onPress={() => router.push(`/product/${id}`)}
                style={[styles.bestRow, { backgroundColor: t.surface, borderColor: t.line }]}
              >
                <Text style={[styles.bestRank, { color: t.ink3 }]}>{i + 1}</Text>
                <View style={styles.bestImage}>
                  <ProductImage product={p} aspectRatio={1} radius={8} />
                </View>
                <View style={styles.bestInfo}>
                  <Text style={[styles.bestBrand, { color: t.ink3 }]} numberOfLines={1}>
                    {p.brand}
                  </Text>
                  <Text style={[styles.bestName, { color: t.ink }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Rating value={p.rating} reviews={p.reviews} size={10} />
                </View>
                <Price price={p.price} was={p.was} size={13} />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Tags */}
      <View style={styles.section}>
        <SectionHead eyebrow="Trending" title="Popular tags" />
        <View style={styles.tagRow}>
          {fragTags.map((tag) => (
            <Chip key={tag} onPress={() => router.push({ pathname: '/(tabs)/search', params: { q: tag } })}>
              # {tag}
            </Chip>
          ))}
        </View>
      </View>

      {/* New arrivals */}
      <View style={styles.section}>
        <SectionHead eyebrow="Just in" title="New arrivals" />
        <View style={styles.grid}>
          {newArrivalIds.map((id) => {
            const p = fragProductMap[id];
            return (
              <View key={id} style={styles.gridItem}>
                <ProductCard product={p} onPress={() => router.push(`/product/${id}`)} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Brand callout */}
      <View style={styles.section}>
        <View style={[styles.callout, { backgroundColor: t.ink }]}>
          <Text style={[styles.calloutEyebrow, { color: t.ink3 }]}>HOUSE NOTE · 01</Text>
          <Text style={[styles.calloutTitle, { color: t.bg }]}>
            Made in small batches, from the Douro valley and further on.
          </Text>
          <View style={styles.calloutBtnRow}>
            <FragButton size="sm" variant="ghostOnDark">
              Our story
            </FragButton>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
