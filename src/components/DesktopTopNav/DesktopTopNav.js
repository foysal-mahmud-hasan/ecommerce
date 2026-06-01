import { useRouter, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import {
  IconBag,
  IconGrid,
  IconHeart,
  IconHome,
  IconSearch,
  IconUser,
} from '../Icons';
import Logo from '../Logo';
import { fragCartCount, useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { styles } from './DesktopTopNav.styles';

// Primary nav links. `match` decides the active state from the current
// pathname (startsWith so /products/123, /category/x etc. keep Catalog lit).
const NAV_ITEMS = [
  { key: 'shop', label: 'Shop', href: '/', icon: IconHome, match: (p) => p === '/' || p === '/index' },
  { key: 'catalog', label: 'Catalog', href: '/products', icon: IconGrid, match: (p) => p.startsWith('/products') || p.startsWith('/category') || p.startsWith('/product') },
  { key: 'saved', label: 'Saved', href: '/saved', icon: IconHeart, match: (p) => p.startsWith('/saved') },
  { key: 'orders', label: 'Orders', href: '/orders', icon: IconBag, match: (p) => p.startsWith('/orders') },
];

// Desktop/web top navigation bar. Rendered globally by the shell on web ≥768;
// replaces the bottom tab bar (which is hidden at that breakpoint). Navigation
// is via expo-router; active link is derived from usePathname().
export default function DesktopTopNav() {
  const t = useTheme();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const { cart } = useStore();
  const cartCount = fragCartCount(cart);
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    const q = query.trim();
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`);
  };

  return (
    <View style={[styles.bar, { backgroundColor: t.surface, borderBottomColor: t.line }]}>
      <View style={styles.inner}>
        <Pressable onPress={() => router.push('/')} accessibilityLabel="Home">
          <Logo size="sm" />
        </Pressable>

        <View style={styles.navLinks}>
          {NAV_ITEMS.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Pressable
                key={item.key}
                onPress={() => router.push(item.href)}
                hitSlop={layout.hitSlop}
                style={[
                  styles.navLink,
                  active && { borderBottomColor: t.terra },
                ]}
                accessibilityRole="link"
                accessibilityState={{ selected: active }}
              >
                <Icon color={active ? t.terra : t.ink2} size={16} />
                <Text
                  style={[
                    styles.navLinkText,
                    {
                      color: active ? t.terra : t.ink2,
                      fontFamily: active ? t.fonts.sansSemiBold : t.fonts.sansMedium,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.searchWrap, { backgroundColor: t.bg, borderColor: t.line }]}>
          <IconSearch color={t.ink3} size={16} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search medicines, health products..."
            placeholderTextColor={t.ink3}
            style={[styles.searchInput, { color: t.ink }]}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={submitSearch}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push('/cart')}
            hitSlop={layout.hitSlop}
            style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Cart"
          >
            <IconBag color={t.ink} size={18} />
            {cartCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: t.terra }]}>
                <Text style={[styles.badgeText, { fontFamily: t.fonts.sansSemiBold }]}>
                  {cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            onPress={() => router.push('/me')}
            hitSlop={layout.hitSlop}
            style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line }]}
            accessibilityLabel="Account"
          >
            <IconUser color={t.ink} size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
