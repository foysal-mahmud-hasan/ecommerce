import { Platform, StyleSheet } from 'react-native';
import { fonts, fontSize, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenPadding,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    paddingVertical: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
  },
  footer: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.sm,
    letterSpacing: 1,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipRail: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: screenPadding,
    paddingBottom: 12,
  },
  chipRailScroll: {
    // ScrollView defaults to flex:1 on react-native-web, which would compete
    // with the FlatList for vertical space and squash these horizontal rails.
    flexGrow: 0,
    flexShrink: 0,
  },
  countRow: {
    paddingHorizontal: screenPadding,
    paddingTop: 4,
    paddingBottom: 8,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  grid: {
    paddingHorizontal: screenPadding,
    paddingBottom: 80,
  },
  gridRow: {
    justifyContent: 'flex-start',
    marginBottom: 22,
    gap: 14,
  },
  empty: {
    paddingVertical: 64,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
  },
});
