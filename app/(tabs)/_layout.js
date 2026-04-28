import { Tabs } from 'expo-router';
import React from 'react';
import {
  IconBag,
  IconHeart,
  IconHome,
  IconSearch,
  IconUser,
} from '../../src/components/Icons';
import { fragCartCount, useStore } from '../../src/store/StoreContext';
import { fonts, useTheme } from '../../src/theme';

export default function TabsLayout() {
  const t = useTheme();
  const { cart } = useStore();
  const cartCount = fragCartCount(cart);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.ink,
        tabBarInactiveTintColor: t.ink3,
        tabBarStyle: {
          backgroundColor: t.bg,
          borderTopColor: t.line,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
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
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSearch color={color} size={18} />,
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
    </Tabs>
  );
}
