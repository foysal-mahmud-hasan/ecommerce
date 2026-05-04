import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import { IconSliders } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
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
  const { categories, productsCache, openQuickView } = useStore();
  const bp = useBreakpoint();
  const { width: winW } = useWindowDimensions();
  const cols = bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  const gridGap = 14;
  const nativeContainerW = Math.max(0, winW - screenPadding * 2);
  const cellWidth = Platform.OS === 'web'
    ? `calc(${100 / cols}% - ${(gridGap * (cols - 1)) / cols}px)`
    : (nativeContainerW - gridGap * (cols - 1)) / cols;

  const catName = (categories || []).find((c) => String(c.id) === cat)?.name || 'All';

  const products = useMemo(() => {
    let list = productsCache?.byCategoryId?.[cat] || [];
    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return sortInStockFirst(list);
  }, [productsCache, cat, sort]);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader
        title={catName}
        onBack={() => router.back()}
        right={
          <Pressable
            hitSlop={layout.hitSlop}
            style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Filters"
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
        <Text style={[styles.count, { color: t.ink3 }]}>
          {products.length} item{products.length !== 1 ? 's' : ''} · {catName.toLowerCase()}
        </Text>
        <View style={[styles.grid, { gap: gridGap }]}>
          {products.map((p) => (
            <View
              key={p.id}
              style={{ width: cellWidth, flexGrow: 0, flexShrink: 0 }}
            >
              <ProductCard
                product={p}
                onPress={() => openQuickView(p.id)}
                onLongPress={() => router.push(`/product/${p.id}`)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
