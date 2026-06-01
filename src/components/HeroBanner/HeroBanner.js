import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { bannersFor } from '../../data/banners';
import { useStore } from '../../store/StoreContext';
import { useTheme } from '../../theme';
import { useBreakpoint } from '../../utils/responsive';
import { styles } from './HeroBanner.styles';

const AUTO_ADVANCE_MS = 5000;

// Aspect ratios per breakpoint. Mobile is taller (room for stacked text).
function aspectFor(bp) {
  if (bp === 'desktop') return 16 / 6; // wide on desktop
  if (bp === 'tablet') return 16 / 7;
  return 16 / 9;
}

export default function HeroBanner({ tenant: tenantOverride }) {
  const t = useTheme();
  const router = useRouter();
  const { tenant } = useStore();
  const tenantId = tenantOverride || tenant?.id || 'pharma';
  const banners = useMemo(() => bannersFor(tenantId), [tenantId]);

  const bp = useBreakpoint();
  const aspect = aspectFor(bp);
  const { width: screenW } = useWindowDimensions();
  // The app caps at 1280pt centered on web — use min(screen, 1280) for layout.
  const containerWidth = Math.min(screenW, 1280);
  // 20pt horizontal padding from styles.wrap.
  const cardWidth = Math.max(280, containerWidth - 40);
  const cardHeight = cardWidth / aspect;

  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);
  const pausedUntilRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < pausedUntilRef.current) return;
      setActiveIndex((idx) => {
        const next = (idx + 1) % banners.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [banners.length]);

  const onMomentumScrollEnd = useCallback(
    (e) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / cardWidth);
      if (idx !== activeIndex && idx >= 0 && idx < banners.length) {
        setActiveIndex(idx);
      }
      // Pause auto-advance for 8s after manual interaction.
      pausedUntilRef.current = Date.now() + 8000;
    },
    [activeIndex, banners.length, cardWidth],
  );

  // Scale the headline up on larger viewports — a 22px title is lost in a
  // ~460px-tall desktop banner.
  const titleSize = bp === 'desktop' ? 40 : bp === 'tablet' ? 30 : 22;
  const subSize = bp === 'desktop' ? 16 : bp === 'tablet' ? 14 : 12;
  const ctaTall = bp === 'desktop' || bp === 'tablet';

  const renderItem = useCallback(
    ({ item }) => {
      const isDark = item.tone !== 'light';
      const fg = isDark ? '#fff' : t.ink;
      const ctaBg = isDark ? '#fff' : t.ink;
      const ctaFg = isDark ? t.ink : t.bg;
      return (
        <View style={[styles.card, { width: cardWidth, height: cardHeight, backgroundColor: t.surfaceDeep }]}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            recyclingKey={item.id}
          />
          {isDark ? (
            <>
              <View style={styles.overlay} pointerEvents="none" />
              <View style={styles.scrimMid} pointerEvents="none" />
              <View style={styles.scrimBottom} pointerEvents="none" />
            </>
          ) : (
            <View style={styles.overlayLight} pointerEvents="none" />
          )}
          <View style={styles.content}>
            <Text style={[styles.eyebrow, { color: isDark ? 'rgba(255,255,255,0.85)' : t.ink3 }]} numberOfLines={1}>
              {item.kind === 'offer' ? 'OFFER' : item.kind === 'top' ? 'TOP PICK' : 'DEAL'}
            </Text>
            <Text
              style={[styles.title, { color: fg, fontSize: titleSize, lineHeight: Math.round(titleSize * 1.12) }]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text
                style={[
                  styles.subtitle,
                  { color: isDark ? 'rgba(255,255,255,0.9)' : t.ink2, fontSize: subSize, lineHeight: Math.round(subSize * 1.4) },
                ]}
                numberOfLines={2}
              >
                {item.subtitle}
              </Text>
            ) : null}
            <View style={styles.ctaRow}>
              <Pressable
                onPress={() => router.push(item.ctaTarget)}
                style={({ pressed }) => [
                  styles.ctaBtn,
                  ctaTall && { height: 46, paddingHorizontal: 24 },
                  { backgroundColor: ctaBg, opacity: pressed ? 0.85 : 1 },
                ]}
                accessibilityRole="button"
              >
                <Text style={[styles.ctaText, ctaTall && { fontSize: 15 }, { color: ctaFg }]}>{item.ctaLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [cardWidth, cardHeight, router, t, titleSize, subSize, ctaTall],
  );

  const getItemLayout = useCallback(
    (_, index) => ({ length: cardWidth, offset: cardWidth * index, index }),
    [cardWidth],
  );

  if (!banners.length) return null;

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={banners}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToInterval={cardWidth}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={getItemLayout}
        initialNumToRender={1}
        windowSize={3}
      />
      <View style={styles.dotsRow}>
        {banners.map((b, i) => {
          const active = i === activeIndex;
          return (
            <View
              key={b.id}
              style={[
                styles.dot,
                {
                  width: active ? 16 : 6,
                  backgroundColor: active ? t.ink : t.line,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}
