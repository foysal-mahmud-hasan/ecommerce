import { Platform, StyleSheet } from 'react-native';
import { fontSize, layout, radius } from '../../theme';

// Top navigation bar shown on web ≥768 (tablet + desktop). The bar background
// spans full width; an inner row caps content at the shell width with gutters.
// Surface bg + bottom hairline + soft web shadow follows the established
// navbar-elevation rule.
export const styles = StyleSheet.create({
  bar: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 100,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }
      : null),
  },
  inner: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    height: layout.topNavHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navLinkText: {
    fontSize: fontSize.lg,
    letterSpacing: 0.2,
  },
  // Search input grows to fill the middle of the bar.
  searchWrap: {
    flex: 1,
    minWidth: 120,
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : null),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
  },
});
