import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import { IconSearch, IconSliders } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { styles } from './ProductsScreen.styles';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'name', label: 'A–Z' },
];

// Debounce hook — keeps search snappy without filtering on every keystroke.
function useDebounced(value, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

export default function ProductsScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const { categories, productsCache, openQuickView } = useStore();

  const [query, setQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');
  const [sort, setSort] = useState('featured');
  const debouncedQuery = useDebounced(query, 200);

  // 2 cols on mobile, 3 on tablet, 4 on desktop. Each card width adjusts so
  // FlatList numColumns + percentage width keeps spacing even.
  const numColumns = bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  const cardWidthPct = numColumns === 4 ? '23.5%' : numColumns === 3 ? '32%' : '48%';

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
    return list;
  }, [productsCache, activeCategoryId, debouncedQuery, sort]);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidthPct }}>
        <ProductCard
          product={item}
          onPress={() => openQuickView(item.id)}
          onLongPress={() => router.push(`/product/${item.id}`)}
        />
      </View>
    ),
    [openQuickView, router, cardWidthPct],
  );

  const keyExtractor = useCallback((item) => item.id, []);

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
              <Text style={{ color: t.ink3, fontSize: 14 }}>×</Text>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRail}
      >
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
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRail}
      >
        {SORTS.map((s) => (
          <Chip key={s.id} active={sort === s.id} onPress={() => setSort(s.id)}>
            {s.label}
          </Chip>
        ))}
      </ScrollView>

      <View style={styles.countRow}>
        <Text style={[styles.count, { color: t.ink3 }]}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </Text>
      </View>

      <FlatList
        key={numColumns}
        data={filtered}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={[
          styles.grid,
          { paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
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
