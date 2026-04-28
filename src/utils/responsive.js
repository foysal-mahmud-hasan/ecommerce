import React from 'react';
import { Dimensions, PixelRatio, Platform, useWindowDimensions, View } from 'react-native';

const BASE_WIDTH = 390;

// Static scale — used by stylesheets created at module load (legacy).
const { width: initialWidth } = Dimensions.get('window');
export function scale(n) {
  return PixelRatio.roundToNearestPixel((initialWidth / BASE_WIDTH) * n);
}

export function isSmallDevice() {
  return initialWidth < 375;
}

// Live breakpoint hook. Reads useWindowDimensions so it re-renders on resize
// (matters for web — phone has fixed dimensions).
//
//   mobile   <  768   (phones)
//   tablet  768–1279  (small laptops, large phones in landscape)
//   desktop ≥ 1280   (desktop browsers)
export function useBreakpoint() {
  const { width } = useWindowDimensions();
  if (width >= 1280) return 'desktop';
  if (width >= 768) return 'tablet';
  return 'mobile';
}

export function useIsDesktop() {
  return useBreakpoint() === 'desktop';
}

export function useIsWeb() {
  return Platform.OS === 'web';
}

// Width to use for layout. On web, caps at 480pt so screens render in a
// phone-shaped column. Per-screen `maxWidth` override widens this.
export function useResponsiveWidth(maxWidth = 480) {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return width;
  return Math.min(width, maxWidth);
}

// Wrapper component that centers its content on web with a phone-shaped
// max-width column by default, full-width on native. Use `maxWidth` to widen
// for screens that benefit from desktop space (All Products, PDP).
export function ResponsiveScreen({ children, maxWidth = 480, style }) {
  if (Platform.OS !== 'web') {
    return <View style={[{ flex: 1 }, style]}>{children}</View>;
  }
  return (
    <View
      style={[
        { flex: 1, alignItems: 'center', backgroundColor: 'transparent' },
        style,
      ]}
    >
      <View style={{ flex: 1, width: '100%', maxWidth, alignSelf: 'center' }}>
        {children}
      </View>
    </View>
  );
}
