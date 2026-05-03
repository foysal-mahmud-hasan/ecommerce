import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BasketIconButton } from '../../../components/AddToCartButton';
import { IconChevR, IconSearch, IconX } from '../../../components/Icons';
import RemoteImage from '../../../components/RemoteImage';
import { useStore } from '../../../store/StoreContext';
import { layout, useTheme } from '../../../theme';
import { formatPrice, percentOff } from '../../../utils/format';
import { isInStock, sortInStockFirst } from '../../../utils/sortStock';
import { useDebounced } from '../../../utils/useDebounced';
import { styles } from './HomeSearchBar.styles';

const MAX_RESULTS = 30;
const MAX_HEIGHT_WEB = 420;
const MAX_HEIGHT_MOBILE = 360;

// Spotlight-style overlay search. Input stays in place; results render in a
// floating absolute-positioned card below it with a backdrop scrim.
//
// Props:
//   query          — controlled query string
//   onQueryChange  — setter
//   placeholder    — input placeholder
export default function HomeSearchBar({ query, onQueryChange, placeholder }) {
  const t = useTheme();
  const router = useRouter();
  const { productsCache, currency } = useStore();
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
    <View style={[styles.wrap, { zIndex: 50 }]}>
      <View style={{ position: 'relative' }}>
        <View
          style={[
            styles.inputRow,
            { backgroundColor: t.surface, borderColor: isActive ? t.terra : t.line },
          ]}
        >
          <IconSearch color={t.ink3} size={16} />
          <TextInput
            value={query}
            onChangeText={onQueryChange}
            placeholder={placeholder || 'Search medicines, health products...'}
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
              styles.spotlight,
              {
                backgroundColor: t.surface,
                borderColor: t.line,
              },
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
                    onOpen={() => {
                      onQueryChange('');
                      router.push(`/product/${p.id}`);
                    }}
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
              <Text style={[styles.footerText, { color: t.terra }]}>
                View all results for "{query.trim()}"
              </Text>
              <IconChevR color={t.terra} size={16} />
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ResultRow({ product, t, currency, onOpen, showDivider }) {
  const inStock = isInStock(product);
  const discount = percentOff(product.price, product.was);
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
          <Text style={[styles.resultName, { color: t.ink }]} numberOfLines={1}>
            {product.name}
          </Text>
          <Text
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 11,
              color: t.ink3,
            }}
            numberOfLines={1}
          >
            {product.unit || 'Tablets'}
            {!inStock ? '  ·  Out of stock' : ''}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4, marginRight: 6 }}>
          <Text style={[styles.resultPrice, { color: t.ink }]}>
            {formatPrice(product.price, currency)}
          </Text>
          {discount > 0 ? (
            <View
              style={{
                backgroundColor: t.terra,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: t.fonts.sansSemiBold,
                  fontSize: 10,
                  color: '#FFFFFF',
                }}
              >
                {discount}%
              </Text>
            </View>
          ) : null}
        </View>
        <BasketIconButton product={product} size={34} />
      </Pressable>
      {showDivider ? <View style={[styles.divider, { backgroundColor: t.line }]} /> : null}
    </>
  );
}
