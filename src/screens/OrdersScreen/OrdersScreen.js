import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Badge from '../../components/Badge';
import Chip from '../../components/Chip';
import { IconChevR } from '../../components/Icons';
import MobileHeader from '../../components/MobileHeader';
import RemoteImage from '../../components/RemoteImage';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { formatPrice } from '../../utils/format';
import { styles } from './OrdersScreen.styles';

const TABS = ['All', 'Placed', 'Delivered'];

function formatDate(o) {
  // Backend orders carry a "DD-MM-YYYY" string under createdAt and a parsed
  // ms timestamp under placedAt. Use whichever is available.
  if (o?.createdAt) return o.createdAt;
  if (o?.placedAt) return new Date(o.placedAt).toLocaleDateString();
  return '';
}

export default function OrdersScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { auth, orders, currency, loadOrders, ordersStatus } = useStore();
  const [tab, setTab] = useState('All');

  // Pull live history every time the screen mounts when the user is signed in.
  useEffect(() => {
    if (auth?.user?.id || auth?.userId) loadOrders();
  }, [auth, loadOrders]);

  const filtered = useMemo(() => {
    if (tab === 'All') return orders;
    return orders.filter((o) => (o.status || 'placed').toLowerCase() === tab.toLowerCase());
  }, [orders, tab]);

  if (!auth) {
    return (
      <View style={[styles.container, { backgroundColor: t.bg }]}>
        <MobileHeader title="Orders" onBack={() => router.back()} />
        <View style={[styles.list, { alignItems: 'center', justifyContent: 'center', flex: 1, paddingHorizontal: 32 }]}>
          <Text
            style={{
              fontFamily: t.fonts.display,
              fontSize: 22,
              color: t.ink,
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Sign in to see orders
          </Text>
          <Text
            style={{
              fontFamily: t.fonts.sans,
              fontSize: 13,
              color: t.ink3,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 20,
            }}
          >
            Your past purchases and active deliveries will live here.
          </Text>
          <Pressable
            onPress={() => router.push('/(auth)/welcome')}
            style={{
              backgroundColor: t.ink,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: t.bg, fontFamily: t.fonts.sansSemiBold, fontSize: 13 }}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <MobileHeader title="Orders" onBack={() => router.back()} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabsRow, { borderBottomColor: t.line }]}
      >
        {TABS.map((x) => (
          <Chip key={x} active={tab === x} onPress={() => setTab(x)}>
            {x}
          </Chip>
        ))}
      </ScrollView>
      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + layout.tabBarHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && ordersStatus === 'loading' ? (
          <View style={{ paddingVertical: 32, alignItems: 'center' }}>
            <ActivityIndicator color={t.terra} />
          </View>
        ) : null}
        {filtered.length === 0 && ordersStatus !== 'loading' ? (
          <Text style={[styles.empty, { color: t.ink3 }]}>
            No {tab.toLowerCase()} orders yet.
          </Text>
        ) : null}
        {filtered.map((o) => (
          <View
            key={o.id}
            style={[styles.card, { backgroundColor: t.surface, borderColor: t.line }]}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={[styles.orderId, { color: t.ink3 }]}>
                  {(o.invoice || o.id || '').toString().toUpperCase()}
                </Text>
                <Text style={[styles.orderDate, { color: t.ink2 }]}>{formatDate(o)}</Text>
              </View>
              <Badge tone={/delivered|completed/i.test(o.status || '') ? 'quiet' : 'sale'}>
                {(o.status || 'placed').replace(/^\w/, (c) => c.toUpperCase())}
              </Badge>
            </View>
            <View style={styles.thumbRow}>
              {(o.items || []).slice(0, 4).map((it, idx) => (
                <View key={`${it.productId}-${idx}`} style={styles.thumb}>
                  <RemoteImage
                    product={{ id: it.productId, name: it.name, image: it.image }}
                    aspectRatio={1}
                    radius={6}
                  />
                </View>
              ))}
              <Text style={[styles.thumbCount, { color: t.ink3 }]}>
                {o.items.length} item{o.items.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={[styles.cardBottom, { borderTopColor: t.line }]}>
              <Text style={[styles.cardTotal, { color: t.ink }]}>
                {formatPrice(o.total, o.currency || currency)}
              </Text>
              <Pressable hitSlop={layout.hitSlop} style={styles.trackBtn}>
                <Text style={[styles.trackText, { color: t.ink2 }]}>Track</Text>
                <IconChevR color={t.ink2} size={14} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
