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
          <View style={isDark ? styles.overlay : styles.overlayLight} />
          <View style={styles.content}>
            <Text style={[styles.eyebrow, { color: isDark ? 'rgba(255,255,255,0.85)' : t.ink3 }]} numberOfLines={1}>
              {item.kind === 'offer' ? 'OFFER' : item.kind === 'top' ? 'TOP PICK' : 'DEAL'}
            </Text>
            <Text style={[styles.title, { color: fg }]} numberOfLines={2}>
              {item.title}
            </Text>
            {item.subtitle ? (
              <Text style={[styles.subtitle, { color: isDark ? 'rgba(255,255,255,0.85)' : t.ink2 }]} numberOfLines={2}>
                {item.subtitle}
              </Text>
            ) : null}
            <View style={styles.ctaRow}>
              <Pressable
                onPress={() => router.push(item.ctaTarget)}
                style={({ pressed }) => [
                  styles.ctaBtn,
                  { backgroundColor: ctaBg, opacity: pressed ? 0.85 : 1 },
                ]}
                accessibilityRole="button"
              >
                <Text style={[styles.ctaText, { color: ctaFg }]}>{item.ctaLabel}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      );
    },
    [cardWidth, cardHeight, router, t],
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
