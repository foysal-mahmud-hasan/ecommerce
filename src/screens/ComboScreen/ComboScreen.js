import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Chip from '../../components/Chip';
import ComboCard from '../../components/ComboCard';
import FragButton from '../../components/FragButton';
import {
  IconChevL,
  IconHeart,
  IconShield,
  IconSpark,
  IconSwap,
  IconTruck,
  IconX,
} from '../../components/Icons';
import ProductCard from '../../components/ProductCard';
import ProductImage from '../../components/ProductImage';
import { fragComboMap, fragCombos } from '../../data/combos';
import { fragProductMap, fragProducts } from '../../data/products';
import { useStore } from '../../store/StoreContext';
import { layout, useTheme } from '../../theme';
import { styles } from './ComboScreen.styles';

const LAYOUTS = [
  { id: 'flatlay', label: 'Flatlay' },
  { id: 'stack', label: 'Stacked' },
  { id: 'look', label: 'Worn together' },
];

const PERKS = [
  { icon: 'truck', text: 'Free shipping on sets over $150' },
  { icon: 'shield', text: 'Swap or return any piece within 30 days' },
  { icon: 'spark', text: 'Bundle saving applied automatically' },
];

function PerkIcon({ name, color }) {
  if (name === 'truck') return <IconTruck color={color} size={16} />;
  if (name === 'shield') return <IconShield color={color} size={16} />;
  return <IconSpark color={color} size={14} />;
}

export default function ComboScreen() {
  const t = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const combo = fragComboMap[typeof id === 'string' ? id : 'c1'] || fragCombos[0];
  const { comboLayout, setComboLayout, addMany, builder, setBuilderItems } = useStore();

  const initial = builder[combo.id]?.items || combo.items;
  const [items, setItems] = useState(initial);
  const [swapSlot, setSwapSlot] = useState(null);

  const products = items.map((pid) => fragProductMap[pid]);
  const sum = products.reduce((s, p) => s + p.price, 0);
  const save = Math.max(0, sum - combo.price);
  const finalPrice = Math.min(sum, combo.price);

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const swapCandidates =
    swapSlot != null
      ? fragProducts.filter(
          (p) => p.cat === products[swapSlot].cat && !items.includes(p.id)
        )
      : [];

  const openSwap = (idx) => {
    setSwapSlot(idx);
    sheetRef.current?.present();
  };
  const closeSwap = () => {
    sheetRef.current?.dismiss();
    setSwapSlot(null);
  };
  const doSwap = (newId) => {
    const next = [...items];
    next[swapSlot] = newId;
    setItems(next);
    setBuilderItems(combo.id, next, true);
    closeSwap();
  };

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.55}
        pressBehavior="close"
      />
    ),
    []
  );

  const onAddSet = () => {
    addMany(items);
    router.push('/(tabs)/cart');
  };

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + layout.buyBarHeight + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero (dark) */}
        <View style={[styles.hero, { backgroundColor: t.ink, paddingTop: insets.top + 8 }]}>
          <View style={styles.heroTopRow}>
            <Pressable
              onPress={() => router.back()}
              hitSlop={layout.hitSlop}
              style={styles.heroBtn}
              accessibilityLabel="Back"
            >
              <IconChevL color="#fff" size={16} />
            </Pressable>
            <Pressable
              hitSlop={layout.hitSlop}
              style={styles.heroBtn}
              accessibilityLabel="Save combo"
            >
              <IconHeart color="#fff" size={17} />
            </Pressable>
          </View>
          <Text style={[styles.heroEyebrow, { color: t.ink3 }]}>
            {`THE COMBO · ${combo.occasion.toUpperCase()} · ${combo.season.toUpperCase()}`}
          </Text>
          <Text style={styles.heroTitle}>{combo.name}</Text>
          <Text style={styles.heroTagline}>{combo.tagline}</Text>

          <View style={styles.savingsRow}>
            <View style={styles.savingsCol}>
              <Text style={[styles.savingsLabel, { color: t.ink3 }]}>SET PRICE</Text>
              <Text style={styles.savingsBig}>${finalPrice}</Text>
            </View>
            <View style={[styles.savingsCol, styles.flex1]}>
              <Text style={[styles.savingsLabel, { color: t.ink3 }]}>INDIVIDUAL</Text>
              <Text style={[styles.savingsStrike, { color: t.ink3 }]}>${sum}</Text>
            </View>
            {save > 0 ? (
              <View style={[styles.savePill, { backgroundColor: t.terra }]}>
                <Text style={styles.savePillText}>Save ${save}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Builder */}
        <View style={styles.section}>
          <View style={styles.builderHeader}>
            <View>
              <Text style={[styles.sectionEyebrow, { color: t.ink3 }]}>
                YOUR SET · {products.length} PIECES
              </Text>
              <Text style={[styles.sectionTitle, { color: t.ink }]}>Build it yours</Text>
            </View>
            <Pressable
              onPress={() => setItems(combo.items)}
              hitSlop={layout.hitSlop}
            >
              <Text style={[styles.resetBtn, { color: t.ink2 }]}>Reset</Text>
            </Pressable>
          </View>

          <View style={styles.slotList}>
            {products.map((p, i) => (
              <View
                key={i}
                style={[styles.slot, { backgroundColor: t.surface, borderColor: t.line }]}
              >
                <View style={styles.slotImage}>
                  <ProductImage product={p} aspectRatio={1} radius={8} />
                </View>
                <View style={styles.slotInfo}>
                  <Text style={[styles.slotBrand, { color: t.ink3 }]} numberOfLines={1}>
                    {p.brand} · Slot {i + 1}
                  </Text>
                  <Text style={[styles.slotName, { color: t.ink }]} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={[styles.slotPrice, { color: t.ink2 }]}>${p.price}</Text>
                </View>
                <Pressable
                  onPress={() => openSwap(i)}
                  hitSlop={layout.hitSlop}
                  style={[styles.swapBtn, { backgroundColor: t.surfaceAlt }]}
                >
                  <IconSwap color={t.ink2} />
                  <Text style={[styles.swapBtnText, { color: t.ink2 }]}>Swap</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Layout toggle + preview */}
          <View style={[styles.previewBlock, { backgroundColor: t.surfaceAlt }]}>
            <Text style={[styles.sectionEyebrow, { color: t.ink3, marginBottom: 10 }]}>
              PREVIEW LAYOUT
            </Text>
            <View style={styles.layoutChips}>
              {LAYOUTS.map((l) => (
                <Chip
                  key={l.id}
                  active={comboLayout === l.id}
                  onPress={() => setComboLayout(l.id)}
                >
                  {l.label}
                </Chip>
              ))}
            </View>
            <View style={styles.previewCard}>
              <ComboCard combo={{ ...combo, items }} layout={comboLayout} />
            </View>
          </View>

          {/* Perks */}
          <View style={[styles.perksCard, { backgroundColor: t.surface, borderColor: t.line }]}>
            {PERKS.map((perk, i) => (
              <View
                key={perk.text}
                style={[
                  styles.perkRow,
                  i < PERKS.length - 1 && { borderBottomColor: t.line, borderBottomWidth: 1 },
                ]}
              >
                <PerkIcon name={perk.icon} color={t.ink2} />
                <Text style={[styles.perkText, { color: t.ink2 }]}>{perk.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: t.bg,
            borderTopColor: t.line,
            paddingBottom: 12 + insets.bottom,
          },
        ]}
      >
        <View style={styles.bottomBarLeft}>
          <Text style={[styles.bottomLabel, { color: t.ink3 }]}>
            Total · {products.length} pieces
          </Text>
          <View style={styles.bottomPriceRow}>
            <Text style={[styles.bottomPrice, { color: t.ink }]}>${finalPrice}</Text>
            <Text style={[styles.bottomWas, { color: t.ink3 }]}>${sum}</Text>
          </View>
        </View>
        <View style={styles.bottomBtn}>
          <FragButton variant="primary" size="md" onPress={onAddSet} full>
            Add set to cart
          </FragButton>
        </View>
      </View>

      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleStyle={[styles.sheetHandle, { backgroundColor: t.bg }]}
        handleIndicatorStyle={{ backgroundColor: t.lineStrong }}
        backgroundStyle={{ backgroundColor: t.bg }}
        onDismiss={() => setSwapSlot(null)}
      >
        <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={[styles.sectionEyebrow, { color: t.ink3, marginBottom: 4 }]}>
                SWAP SLOT {swapSlot != null ? swapSlot + 1 : ''}
              </Text>
              <Text style={[styles.sectionTitle, { color: t.ink }]}>Pick a different piece</Text>
            </View>
            <Pressable onPress={closeSwap} hitSlop={layout.hitSlop} style={styles.sheetClose}>
              <IconX color={t.ink2} />
            </Pressable>
          </View>
          <View style={styles.sheetGrid}>
            {swapCandidates.map((c) => (
              <View key={c.id} style={styles.sheetGridItem}>
                <ProductCard
                  product={c}
                  showWishlist={false}
                  onPress={() => doSwap(c.id)}
                />
              </View>
            ))}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
}
