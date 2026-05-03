import React, { useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';
import { IconHeart } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import ProductCard from '../../components/ProductCard';
import ViewToggle from '../../components/ViewToggle';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { styles } from './WishlistScreen.styles';

export default function WishlistScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const bp = useBreakpoint();
  const { wishlist, productsCache } = useStore();
  const items = wishlist.map((id) => productsCache?.byId?.[id]).filter(Boolean);
  const [view, setView] = useState(bp === 'mobile' ? 'list' : 'grid');

  const cols = bp === 'desktop' ? 4 : bp === 'tablet' ? 3 : 2;
  const gap = 14;
  const cellWidth = Platform.OS === 'web'
    ? `calc(${100 / cols}% - ${(gap * (cols - 1)) / cols}px)`
    : `${(100 - cols + 1) / cols}%`;

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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <Text style={[styles.count, { color: t.ink3, marginBottom: 0 }]}>
              {items.length} saved
            </Text>
            <ViewToggle value={view} onChange={setView} />
          </View>
          {view === 'list' ? (
            <View style={{ gap: 10 }}>
              {items.map((p) => (
                <ProductCard key={p.id} product={p} forceLayout="clinical" />
              ))}
            </View>
          ) : (
            <View style={[styles.grid, { gap }]}>
              {items.map((p) => (
                <View
                  key={p.id}
                  style={{
                    width: cellWidth,
                    flexGrow: 0,
                    flexShrink: 0,
                    flexBasis: 'auto',
                  }}
                >
                  <ProductCard product={p} forceLayout="editorial" />
                </View>
              ))}
            </View>
          )}
          <Footer />
        </ScrollView>
      )}
    </View>
  );
}
