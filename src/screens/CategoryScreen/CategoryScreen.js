import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategoryPickerSheet from '../../components/CategoryPickerSheet';
import Chip from '../../components/Chip';
import { IconSliders } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
import ViewToggle from '../../components/ViewToggle';
import { useStore } from '../../store/StoreContext';
import { layout, screenPadding, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { sortInStockFirst } from '../../utils/sortStock';
import { styles } from './CategoryScreen.styles';

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price ↑' },
  { id: 'high', label: 'Price ↓' },
  { id: 'name', label: 'A–Z' },
];

export default function CategoryScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const cat = typeof id === 'string' ? id : '';
  const [sort, setSort] = useState('featured');
  const [pickerOpen, setPickerOpen] = useState(false);
  const {
    categories,
    productsCache,
    openQuickView,
    loadCategoryProducts,
    categoryStatus,
  } = useStore();
  const bp = useBreakpoint();
  const { width: winW } = useWindowDimensions();
  const [view, setView] = useState(bp === 'mobile' ? 'list' : 'grid');
  // List view is always a single column; grid scales 2→3→4 by breakpoint.
  const cols = view === 'list' ? 1 : bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  const gridGap = 14;
  const nativeContainerW = Math.max(0, winW - screenPadding * 2);
  const cellWidth = Platform.OS === 'web'
    ? `calc(${100 / cols}% - ${(gridGap * (cols - 1)) / cols}px)`
    : (nativeContainerW - gridGap * (cols - 1)) / cols;

  const catName = (categories || []).find((c) => String(c.id) === cat)?.name || 'All';

  // Lazy-load this category's products the first time the screen mounts (or
  // when the `id` param changes). Idempotent — store thunk no-ops if already
  // ready or in flight.
  useEffect(() => {
    if (cat) loadCategoryProducts(cat);
  }, [cat, loadCategoryProducts]);

  const loadState = categoryStatus?.[cat] || 'idle';

  const products = useMemo(() => {
    let list = productsCache?.byCategoryId?.[cat] || [];
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return sortInStockFirst(list, { hideOutOfStock: true });
  }, [productsCache, cat, sort]);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader
        title={catName}
        onBack={() => router.back()}
        right={
          <Pressable
            onPress={() => setPickerOpen(true)}
            hitSlop={layout.hitSlop}
            style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Switch category"
          >
            <IconSliders color={t.ink} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: layout.tabBarHeight + insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.sortRail, { borderBottomColor: t.line }]}
        >
          {SORTS.map((s) => (
            <Chip key={s.id} active={sort === s.id} onPress={() => setSort(s.id)}>
              {s.label}
            </Chip>
          ))}
        </ScrollView>
        <View style={styles.countRow}>
          <Text style={[styles.count, { color: t.ink3 }]}>
            {products.length} item{products.length !== 1 ? 's' : ''} · {catName.toLowerCase()}
          </Text>
          <ViewToggle value={view} onChange={setView} />
        </View>
        {loadState === 'loading' && products.length === 0 ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator color={t.terra} />
          </View>
        ) : null}
        {loadState === 'error' && products.length === 0 ? (
          <Text
            style={{
              color: t.ink3,
              textAlign: 'center',
              paddingVertical: 24,
              fontFamily: t.fonts.sans,
            }}
          >
            Couldn’t load this category. Pull down to retry.
          </Text>
        ) : null}
        <View style={[styles.grid, { gap: gridGap }]}>
          {products.map((p) => (
            <View
              key={p.id}
              style={{ width: cellWidth, flexGrow: 0, flexShrink: 0 }}
            >
              <ProductCard
                product={p}
                forceLayout={view === 'list' ? 'clinical' : 'editorial'}
                compact={view === 'grid'}
                onPress={() => openQuickView(p.id)}
                onLongPress={() => router.push(`/product/${p.id}`)}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <CategoryPickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedId={cat || null}
        onSelect={(id) =>
          id == null ? router.push('/products') : router.replace(`/category/${id}`)
        }
      />
    </View>
  );
}
