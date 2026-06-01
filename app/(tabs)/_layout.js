import { Tabs } from 'expo-router';
import React from 'react';
import {
  IconBag,
  IconGrid,
  IconHeart,
  IconHome,
  IconUser,
} from '../../src/components/Icons';
import { fragCartCount, useStore } from '../../src/store/StoreContext';
import { fonts, useTheme } from '../../src/theme';
import { useIsWebWide } from '../../src/utils/responsive';

export default function TabsLayout() {
  const t = useTheme();
  const { cart } = useStore();
  const cartCount = fragCartCount(cart);
  // On web ≥768 the DesktopTopNav (mounted in the shell) replaces the bottom
  // tab bar, so hide it there. Mobile width / native keeps the bottom bar.
  const webWide = useIsWebWide();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.ink,
        tabBarInactiveTintColor: t.ink3,
        tabBarStyle: {
          backgroundColor: t.surface,
          borderTopColor: t.line,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          ...(webWide ? { display: 'none' } : null),
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 10,
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <IconHome color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Catalog',
          tabBarIcon: ({ color }) => <IconGrid color={color} size={18} />,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <IconHeart color={color} size={20} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <IconBag color={color} size={18} />,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: t.terra,
            color: '#fff',
            fontSize: 10,
            fontFamily: fonts.sansSemiBold,
          },
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color }) => <IconUser color={color} size={18} />,
        }}
      />
      {/* Search tab kept on disk but hidden from the tab bar — search now
          lives inline on home. The route is still reachable via /search. */}
      <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
  );
}
