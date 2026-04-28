import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconBag,
  IconChevR,
  IconHeart,
  IconHome,
  IconShield,
  IconSpark,
  IconUser,
} from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import { useBootstrap } from '../../bootstrap/BootstrapProvider';
import { useStore } from '../../store/StoreContext';
import { fragCartCount } from '../../store/StoreContext';
import {
  TENANT_PHARMA,
  TENANT_RESTAURANT,
  TENANT_LABELS,
} from '../../config/tenants';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { styles } from './AccountScreen.styles';

function MenuIcon({ name, color }) {
  if (name === 'bag') return <IconBag color={color} />;
  if (name === 'heart') return <IconHeart color={color} />;
  if (name === 'home') return <IconHome color={color} />;
  if (name === 'shield') return <IconShield color={color} />;
  if (name === 'spark') return <IconSpark color={color} />;
  return <IconUser color={color} />;
}

export default function AccountScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth, signOut, orders, wishlist, cart, currency, tenant, tenantId } = useStore();
  const { switchTenant } = useBootstrap();

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const stats = [
    [String(orders.length), 'Orders'],
    [String(wishlist.length), 'Saved'],
    [formatPrice(totalSpent, currency), 'Spent'],
  ];

  const MENU = [
    { id: 'orders', label: 'Orders', icon: 'bag', onPress: () => router.push('/orders') },
    { id: 'wishlist', label: 'Wishlist', icon: 'heart', onPress: () => router.push('/(tabs)/saved') },
    { id: 'cart', label: `Cart · ${fragCartCount(cart)} item${fragCartCount(cart) === 1 ? '' : 's'}`, icon: 'shield', onPress: () => router.push('/(tabs)/cart') },
    { id: 'help', label: 'Help & support', icon: 'user', onPress: null },
    { id: 'switch', label: 'Sign in to a different store', icon: 'home', onPress: () => router.push('/tenant-switch') },
  ];

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + layout.tabBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {auth ? (
          <View style={[styles.profile, { backgroundColor: t.ink }]}>
            <View style={[styles.avatar, { backgroundColor: t.terra }]}>
              <Text style={styles.avatarLetter}>
                {(auth.user?.name?.[0] || auth.phone?.[0] || '?').toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: t.bg }]}>
                {auth.user?.name || auth.phone}
              </Text>
              <Text style={[styles.profileSub, { color: t.ink3 }]}>
                {tenant?.name || 'Member'}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.profile, { backgroundColor: t.surfaceAlt, borderColor: t.line, borderWidth: 1 }]}>
            <View style={[styles.avatar, { backgroundColor: t.surface }]}>
              <IconUser color={t.ink2} size={18} />
            </View>
            <View style={styles.profileText}>
              <Text style={[styles.profileName, { color: t.ink }]}>Welcome</Text>
              <Text style={[styles.profileSub, { color: t.ink3 }]}>
                Sign in to track orders and save your cart.
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/(auth)/welcome')}
              style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: t.ink }}
            >
              <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 12 }}>
                Sign in
              </Text>
            </Pressable>
          </View>
        )}

        <View style={styles.statsRow}>
          {stats.map(([v, l]) => (
            <View
              key={l}
              style={[styles.statCard, { backgroundColor: t.surface, borderColor: t.line }]}
            >
              <Text style={[styles.statValue, { color: t.ink }]}>{v}</Text>
              <Text style={[styles.statLabel, { color: t.ink3 }]}>{l}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.menu, { backgroundColor: t.surface, borderColor: t.line }]}>
          {MENU.map((m, i) => (
            <Pressable
              key={m.id}
              onPress={m.onPress || (() => {})}
              disabled={!m.onPress}
              hitSlop={layout.hitSlop}
              style={[
                styles.menuRow,
                i < MENU.length - 1 && { borderBottomColor: t.line, borderBottomWidth: 1 },
                !m.onPress && { opacity: 0.5 },
              ]}
            >
              <MenuIcon name={m.icon} color={t.ink2} />
              <Text style={[styles.menuLabel, { color: t.ink }]}>{m.label}</Text>
              <IconChevR color={t.ink3} size={14} />
            </Pressable>
          ))}
        </View>

        {__DEV__ ? (
          <View style={[styles.menu, { backgroundColor: t.surface, borderColor: t.line, marginTop: 16 }]}>
            <Text
              style={{
                fontFamily: t.fonts.mono,
                fontSize: 10,
                letterSpacing: 1.2,
                color: t.ink3,
                paddingHorizontal: 16,
                paddingTop: 14,
                paddingBottom: 6,
              }}
            >
              DEV · TENANT
            </Text>
            {[TENANT_PHARMA, TENANT_RESTAURANT].map((id, i) => {
              const active = tenantId === id;
              return (
                <Pressable
                  key={id}
                  onPress={async () => {
                    if (active) return;
                    await switchTenant({ tenantId: id });
                  }}
                  style={[
                    styles.menuRow,
                    i === 0 && { borderBottomColor: t.line, borderBottomWidth: 1 },
                  ]}
                >
                  <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 8,
                      borderWidth: 2,
                      borderColor: active ? t.terra : t.line,
                      backgroundColor: active ? t.terra : 'transparent',
                    }}
                  />
                  <Text style={[styles.menuLabel, { color: t.ink }]}>
                    {TENANT_LABELS[id]}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {auth ? (
          <Pressable
            onPress={signOut}
            style={{ alignSelf: 'center', paddingVertical: 24 }}
          >
            <Text style={{ color: t.sale, fontFamily: t.fonts.sansSemiBold, fontSize: 13 }}>
              Sign out
            </Text>
          </Pressable>
        ) : null}

        <Text style={[styles.version, { color: t.ink3 }]}>v 2.4.0</Text>
      </ScrollView>
    </View>
  );
}
