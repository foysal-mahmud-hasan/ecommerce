import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import { useTheme } from '../../theme';
import { IconChevL, IconChevR } from '../Icons';

const SCROLL_STEP = 240;

// Horizontal-scroll wrapper for chip rails. On native it's a plain ScrollView
// (touch-drag works). On web, touch-drag also works but mouse users have no
// scrollbar — so we overlay left/right scroll buttons that fade in when there
// is room to scroll in that direction.
export default function ChipRail({ children, paddingHorizontal = 20, gap = 8 }) {
  const t = useTheme();
  const scrollRef = useRef(null);
  const [layout, setLayout] = useState({ scrollX: 0, contentW: 0, viewportW: 0 });

  const isWeb = Platform.OS === 'web';

  const onScroll = useCallback((e) => {
    setLayout((prev) => ({ ...prev, scrollX: e.nativeEvent.contentOffset.x }));
  }, []);

  const onContentSizeChange = useCallback((w) => {
    setLayout((prev) => ({ ...prev, contentW: w }));
  }, []);

  const onViewportLayout = useCallback((e) => {
    const w = e.nativeEvent.layout.width;
    setLayout((prev) => ({ ...prev, viewportW: w }));
  }, []);

  // On web, force-attach a wheel handler so vertical wheel translates to
  // horizontal scroll inside the rail (matches platform expectation).
  useEffect(() => {
    if (!isWeb) return;
    const node = scrollRef.current?.getScrollableNode?.() || scrollRef.current;
    if (!node || typeof node.addEventListener !== 'function') return;
    const onWheel = (ev) => {
      if (Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
        node.scrollLeft += ev.deltaY;
        ev.preventDefault();
      }
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, [isWeb]);

  const scrollBy = useCallback((delta) => {
    const node = scrollRef.current;
    if (!node) return;
    const next = Math.max(0, layout.scrollX + delta);
    if (typeof node.scrollTo === 'function') {
      node.scrollTo({ x: next, animated: true });
    }
  }, [layout.scrollX]);

  const canScrollLeft = isWeb && layout.scrollX > 4;
  const canScrollRight = isWeb && layout.contentW - layout.viewportW - layout.scrollX > 4;

  return (
    <View
      style={{ width: '100%', minWidth: 0, overflow: 'hidden', position: 'relative' }}
      onLayout={onViewportLayout}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        contentContainerStyle={{ paddingHorizontal, gap }}
        style={
          isWeb
            ? { overflowX: 'auto', overflowY: 'hidden', flexGrow: 0, flexShrink: 1 }
            : undefined
        }
      >
        {children}
      </ScrollView>

      {canScrollLeft ? (
        <ScrollButton side="left" onPress={() => scrollBy(-SCROLL_STEP)} t={t} />
      ) : null}
      {canScrollRight ? (
        <ScrollButton side="right" onPress={() => scrollBy(SCROLL_STEP)} t={t} />
      ) : null}
    </View>
  );
}

function ScrollButton({ side, onPress, t }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={side === 'left' ? 'Scroll left' : 'Scroll right'}
      style={({ pressed }) => ({
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -16 }],
        [side]: 6,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.line,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
        ...(Platform.OS === 'web'
          ? { boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }
          : { elevation: 4, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }),
      })}
    >
      {side === 'left' ? <IconChevL size={14} color={t.ink} /> : <IconChevR size={14} color={t.ink} />}
    </Pressable>
  );
}
