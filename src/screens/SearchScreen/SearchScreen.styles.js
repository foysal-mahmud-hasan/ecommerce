import { Platform, StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  sticky: {
    paddingBottom: 4,
  },
  catRail: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  catChip: {
    height: 34,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catChipText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },
  searchPad: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 46,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15,
    padding: 0,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  activePillText: {
    color: '#FFFFFF',
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm,
  },
  resultCount: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },

  scrollBody: {
    paddingHorizontal: screenPadding,
    paddingTop: 4,
  },
  empty: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['3xl'],
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    rowGap: 22,
  },
  gridItem: { width: '48%' },

  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 1.6,
    marginBottom: 12,
    marginTop: 12,
  },
  eyebrowGap: { marginTop: 24 },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
  },
  trendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  featuredTitle: {
    marginTop: 28,
    marginBottom: 14,
    fontFamily: fonts.serif,
    fontSize: 20,
  },
});
