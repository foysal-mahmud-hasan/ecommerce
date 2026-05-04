import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import ChipRail from '../../components/ChipRail';
import { IconSearch, IconSliders, IconX } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
import ViewToggle from '../../components/ViewToggle';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import { useDebounced } from '../../utils/useDebounced';
import { styles } from './ProductsScreen.styles';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'name', label: 'A–Z' },
];

const PAGE_SIZE = 24;

export default function ProductsScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const { categories, productsCache } = useStore();
  const params = useLocalSearchParams();
  const seedQuery = typeof params.q === 'string' ? params.q : '';

  const [query, setQuery] = useState(seedQuery);
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(0);
  const [view, setView] = useState(bp === 'mobile' ? 'list' : 'grid');
  const debouncedQuery = useDebounced(query, 200);

  // Grid: 2 cols mobile, 3 tablet, 4 desktop. List: always 1 column.
  // (Was 5 cols on desktop — too cramped at the 1280pt cap; 4 matches the
  // home rails so the visual rhythm stays consistent.)
  const numColumns = view === 'list' ? 1 : bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  const gridGap = 14;
  const cardWidthPct =
    view === 'list'
      ? '100%'
      : Platform.OS === 'web'
        ? `calc(${100 / numColumns}% - ${(gridGap * (numColumns - 1)) / numColumns}px)`
        : `${(100 - (numColumns - 1) * 1.5) / numColumns}%`;

  // Apply text + category filter, then sort, then partition by stock so OOS
  // items always sink to the end of the list.
  const filtered = useMemo(() => {
    let list = productsCache?.all || [];
    if (activeCategoryId !== 'all') {
      list = productsCache?.byCategoryId?.[activeCategoryId] || [];
    }
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      list = list.filter((p) => p._search.includes(q));
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return sortInStockFirst(list);
  }, [productsCache, activeCategoryId, debouncedQuery, sort]);

  // Reset paging when filters change. Setting state in the same render as
  // `visible` keeps the list from briefly showing the wrong page.
  useEffect(() => {
    setPage(0);
  }, [activeCategoryId, debouncedQuery, sort]);

  const visible = useMemo(
    () => filtered.slice(0, (page + 1) * PAGE_SIZE),
    [filtered, page],
  );

  const hasMore = visible.length < filtered.length;
  const onEndReached = useCallback(() => {
    if (hasMore) setPage((p) => p + 1);
  }, [hasMore]);

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={{
          width: cardWidthPct,
          flexGrow: 0,
          flexShrink: 0,
        }}
      >
        <ProductCard
          product={item}
          forceLayout={view === 'list' ? 'clinical' : 'editorial'}
          compact={view === 'grid'}
        />
      </View>
    ),
    [cardWidthPct, view],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const ListFooter = useMemo(() => {
    if (filtered.length === 0) return null;
    if (hasMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color={t.ink3} />
          <Text style={[styles.footerText, { color: t.ink3, marginTop: 8 }]}>
            Loading more…
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: t.ink3 }]}>END OF CATALOG</Text>
      </View>
    );
  }, [filtered.length, hasMore, t.ink3]);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader title="All products" onBack={() => router.back()} />
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: t.surface, borderColor: t.line }]}>
          <IconSearch size={16} color={t.ink3} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products"
            placeholderTextColor={t.ink3}
            style={[styles.searchInput, { color: t.ink }]}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query ? (
            <Pressable onPress={() => setQuery('')} hitSlop={layout.hitSlop}>
              <IconX color={t.ink3} size={12} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
          accessibilityLabel="Filters"
        >
          <IconSliders color={t.ink} />
        </Pressable>
      </View>

      <View style={styles.categoryRail}>
        <ChipRail paddingHorizontal={16}>
          <Chip active={activeCategoryId === 'all'} onPress={() => setActiveCategoryId('all')}>
            All
          </Chip>
          {(categories || []).map((c) => (
            <Chip
              key={c.id}
              active={activeCategoryId === c.id}
              onPress={() => setActiveCategoryId(c.id)}
            >
              {c.name}
            </Chip>
          ))}
        </ChipRail>
      </View>

      <View style={styles.sortRail}>
        <ChipRail paddingHorizontal={16}>
          {SORTS.map((s) => (
            <Chip key={s.id} active={sort === s.id} onPress={() => setSort(s.id)}>
              {s.label}
            </Chip>
          ))}
        </ChipRail>
      </View>

      <View style={[styles.countRow, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
        <Text style={[styles.count, { color: t.ink3 }]}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {hasMore ? ` · showing ${visible.length}` : ''}
        </Text>
        <ViewToggle value={view} onChange={setView} />
      </View>

      <FlatList
        key={`${view}-${numColumns}`}
        data={visible}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={PAGE_SIZE / 2}
        maxToRenderPerBatch={PAGE_SIZE / 2}
        windowSize={11}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: t.ink3 }]}>
              No products match your search.
            </Text>
          </View>
        }
      />
    </View>
  );
}
