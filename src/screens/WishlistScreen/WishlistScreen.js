import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconHeart } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { styles } from './WishlistScreen.styles';

export default function WishlistScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { wishlist, productsCache, openQuickView } = useStore();
  const items = wishlist.map((id) => productsCache?.byId?.[id]).filter(Boolean);

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader title="Wishlist" />
      {items.length === 0 ? (
        <View style={styles.empty}>
          <IconHeart size={32} color={t.ink3} />
          <Text style={[styles.emptyTitle, { color: t.ink }]}>Nothing saved yet</Text>
          <Text style={[styles.emptySub, { color: t.ink3 }]}>
            Tap the heart on any item to keep it here.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: insets.bottom + layout.tabBarHeight + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.count, { color: t.ink3 }]}>{items.length} saved</Text>
          <View style={styles.grid}>
            {items.map((p) => (
              <View key={p.id} style={styles.gridItem}>
                <ProductCard
                  product={p}
                  onPress={() => openQuickView(p.id)}
                  onLongPress={() => router.push(`/product/${p.id}`)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
