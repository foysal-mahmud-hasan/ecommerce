import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import { IconChevR, IconSearch, IconX } from '../../components/Icons';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { styles } from './SearchScreen.styles';

const RECENTS = ['paracetamol', 'antacid', 'vitamin c'];
const TRENDING = ['cough', 'flu', 'cold', 'allergy', 'pain'];

export default function SearchScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { categories, productsCache, openQuickView, setSearchQuery } = useStore();
  const [q, setQ] = useState(typeof params.q === 'string' ? params.q : '');
  const [activeCat, setActiveCat] = useState(null);

  useEffect(() => setSearchQuery(q), [q, setSearchQuery]);

  const cats = useMemo(
    () => [{ id: null, label: 'All' }, ...(categories || []).map((c) => ({ id: c.id, label: c.name }))],
    [categories],
  );

  const showResults = q.length > 0 || activeCat !== null;
  const results = useMemo(() => {
    if (!showResults) return [];
    let list = productsCache?.all || [];
    if (activeCat) list = productsCache?.byCategoryId?.[String(activeCat)] || [];
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((p) => p._search.includes(needle));
    }
    return list.slice(0, 60); // cap visible results to keep render light
  }, [showResults, productsCache, activeCat, q]);

  const featured = useMemo(() => (productsCache?.all || []).slice(0, 4), [productsCache]);

  const activeCatLabel = cats.find((c) => c.id === activeCat)?.label;
  const placeholder = activeCat ? `Search in ${activeCatLabel}…` : 'Search products…';

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <View style={[styles.sticky, { paddingTop: insets.top + 8, backgroundColor: t.bg }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRail}
        >
          {cats.map((c) => {
            const active = activeCat === c.id;
            return (
              <Pressable
                key={String(c.id)}
                onPress={() => setActiveCat(c.id === activeCat ? null : c.id)}
                hitSlop={layout.hitSlop}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: active ? t.ink : t.surface,
                    borderColor: active ? t.ink : t.line,
                  },
                ]}
              >
                <Text style={[styles.catChipText, { color: active ? t.bg : t.ink2 }]}>
                  {c.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.searchPad}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: t.surface,
                borderColor: q || activeCat ? t.terra : t.line,
              },
            ]}
          >
            <IconSearch color={q || activeCat ? t.terra : t.ink3} />
            <TextInput
              autoFocus
              value={q}
              onChangeText={setQ}
              placeholder={placeholder}
              placeholderTextColor={t.ink3}
              style={[styles.input, { color: t.ink }]}
              returnKeyType="search"
            />
            {q ? (
              <Pressable onPress={() => setQ('')} hitSlop={layout.hitSlop}>
                <IconX color={t.ink3} />
              </Pressable>
            ) : null}
          </View>
        </View>

        {showResults ? (
          <View style={styles.summaryRow}>
            {activeCat ? (
              <View style={[styles.activePill, { backgroundColor: t.terra }]}>
                <Text style={styles.activePillText}>{activeCatLabel}</Text>
                <Pressable onPress={() => setActiveCat(null)} hitSlop={layout.hitSlop}>
                  <IconX color="#fff" size={12} />
                </Pressable>
              </View>
            ) : null}
            <Text style={[styles.resultCount, { color: t.ink3 }]}>
              {results.length} result{results.length !== 1 ? 's' : ''}
            </Text>
          </View>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollBody,
          { paddingBottom: layout.tabBarHeight + insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {showResults ? (
          results.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: t.ink2 }]}>Nothing just yet</Text>
              <Text style={[styles.emptySub, { color: t.ink3 }]}>
                Try a broader term or a different category.
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {results.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <ProductCard
                    product={p}
                    onPress={() => openQuickView(p.id)}
                    onLongPress={() => router.push(`/product/${p.id}`)}
                  />
                </View>
              ))}
            </View>
          )
        ) : (
          <View>
            <Text style={[styles.eyebrow, { color: t.ink3 }]}>RECENT</Text>
            <View>
              {RECENTS.map((r) => (
                <Pressable
                  key={r}
                  onPress={() => setQ(r)}
                  style={[styles.recentRow, { borderBottomColor: t.line }]}
                >
                  <Text style={[styles.recentText, { color: t.ink2 }]}>{r}</Text>
                  <IconChevR color={t.ink3} size={14} />
                </Pressable>
              ))}
            </View>
            <Text style={[styles.eyebrow, styles.eyebrowGap, { color: t.ink3 }]}>TRENDING</Text>
            <View style={styles.trendingRow}>
              {TRENDING.map((tag) => (
                <Chip key={tag} onPress={() => setQ(tag)}>
                  {tag}
                </Chip>
              ))}
            </View>
            <Text style={[styles.featuredTitle, { color: t.ink }]}>Featured right now</Text>
            <View style={styles.grid}>
              {featured.map((p) => (
                <View key={p.id} style={styles.gridItem}>
                  <ProductCard
                    product={p}
                    onPress={() => openQuickView(p.id)}
                    onLongPress={() => router.push(`/product/${p.id}`)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
