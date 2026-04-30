import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import AddToCartButton from '../../../components/AddToCartButton';
import { IconChevR, IconSearch, IconX } from '../../../components/Icons';
import RemoteImage from '../../../components/RemoteImage';
import { useStore } from '../../../store/StoreContext';
import { layout, useTheme } from '../../../theme';
import { formatPrice } from '../../../utils/format';
import { useDebounced } from '../../../utils/useDebounced';
import { isInStock, sortInStockFirst } from '../../../utils/sortStock';
import { styles } from './HomeSearchBar.styles';

const MAX_RESULTS = 30;
// Smaller dropdown so the home content peeks through underneath — preserves
// the SPA feel ("you didn't navigate anywhere, you just opened a menu").
const MAX_HEIGHT_WEB = 360;
const MAX_HEIGHT_MOBILE = 320;

// Inline search bar for the home screen. Keeps the user on the page —
// results render right under the input. When `query` is empty, the parent
// renders the rest of the home content.
//
// Props:
//   query          — controlled query string
//   onQueryChange  — setter
//   placeholder    — input placeholder
export default function HomeSearchBar({ query, onQueryChange, placeholder }) {
  const t = useTheme();
  const router = useRouter();
  const { productsCache, openQuickView, currency } = useStore();
  const debounced = useDebounced(query, 200);

  const results = useMemo(() => {
    const all = productsCache?.all || [];
    const q = debounced.trim().toLowerCase();
    if (!q) return [];
    const matches = all.filter((p) => p._search?.includes(q));
    return sortInStockFirst(matches).slice(0, MAX_RESULTS);
  }, [productsCache, debounced]);

  const isActive = query.trim().length > 0;
  const maxHeight = Platform.OS === 'web' ? MAX_HEIGHT_WEB : MAX_HEIGHT_MOBILE;

  return (
    <View style={styles.wrap}>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: t.surface, borderColor: isActive ? t.ink2 : t.line },
        ]}
      >
        <IconSearch color={t.ink3} size={16} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={placeholder || 'Search medicines, brands, devices'}
          placeholderTextColor={t.ink3}
          style={[styles.input, { color: t.ink }]}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => {
            if (isActive) router.push(`/products?q=${encodeURIComponent(query)}`);
          }}
        />
        {isActive ? (
          <Pressable
            onPress={() => onQueryChange('')}
            hitSlop={layout.hitSlop}
            style={[styles.clearBtn, { backgroundColor: t.surfaceAlt }]}
            accessibilityLabel="Clear search"
          >
            <IconX color={t.ink3} size={12} />
          </Pressable>
        ) : null}
      </View>

      {isActive ? (
        <View
          style={[
            styles.resultsWrap,
            { backgroundColor: t.surface, borderColor: t.line },
          ]}
        >
          {results.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={[styles.emptyText, { color: t.ink3 }]}>
                No products match "{query.trim()}"
              </Text>
            </View>
          ) : (
            <ScrollView
              style={{ maxHeight }}
              contentContainerStyle={styles.resultsScroll}
              showsVerticalScrollIndicator
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {results.map((p, i) => (
                <ResultRow
                  key={p.id}
                  product={p}
                  t={t}
                  currency={currency}
                  onOpen={() => openQuickView(p.id)}
                  showDivider={i < results.length - 1}
                />
              ))}
            </ScrollView>
          )}

          <Pressable
            onPress={() => router.push(`/products?q=${encodeURIComponent(query)}`)}
            style={[styles.footerRow, { borderTopColor: t.line, backgroundColor: t.surfaceAlt }]}
            accessibilityRole="button"
          >
            <Text style={[styles.footerText, { color: t.ink }]}>See all in catalog</Text>
            <IconChevR color={t.ink} size={16} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function ResultRow({ product, t, currency, onOpen, showDivider }) {
  const inStock = isInStock(product);
  return (
    <>
      <Pressable
        onPress={onOpen}
        style={({ pressed }) => [
          styles.resultRow,
          { opacity: pressed ? 0.92 : 1 },
        ]}
      >
        <View style={styles.resultImage}>
          <RemoteImage product={product} aspectRatio={1} radius={6} />
        </View>
        <View style={styles.resultInfo}>
          {product.brand ? (
            <Text style={[styles.resultBrand, { color: t.ink3 }]} numberOfLines={1}>
              {product.brand}
            </Text>
          ) : null}
          <Text style={[styles.resultName, { color: t.ink }]} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.resultPriceRow}>
            <Text style={[styles.resultPrice, { color: t.ink }]}>
              {formatPrice(product.price, currency)}
            </Text>
            <Text
              style={[
                styles.resultStock,
                { color: inStock ? t.success : t.sale },
              ]}
            >
              {inStock ? 'In stock' : 'Out'}
            </Text>
          </View>
        </View>
        <AddToCartButton product={product} size="compact" />
      </Pressable>
      {showDivider ? <View style={[styles.divider, { backgroundColor: t.line }]} /> : null}
    </>
  );
}
