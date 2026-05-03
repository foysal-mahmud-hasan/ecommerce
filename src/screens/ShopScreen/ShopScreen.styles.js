import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding, shadows } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {},

  stickyHeader: {
    borderBottomWidth: 1,
    paddingBottom: 8,
    zIndex: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingBottom: 10,
  },
  season: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  brand: {
    fontFamily: fonts.serifItalic,
    fontSize: fontSize['3xl'],
    marginTop: 2,
  },
  topActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  ordersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
  },
  ordersText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    rowGap: 10,
  },
  tileCell: {
    flexBasis: 0,
    flexGrow: 1,
    minWidth: 0,
  },
  topIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  topBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBadgeText: {
    color: '#FFFFFF',
    fontFamily: fonts.sansSemiBold,
    fontSize: 9,
  },

  heroPad: {
    paddingHorizontal: screenPadding,
    paddingTop: 6,
  },
  hero: {
    position: 'relative',
    borderRadius: radius.lg,
    overflow: 'hidden',
    aspectRatio: 0.92,
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 6,
    opacity: 0.85,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: 38,
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  heroTitleItalic: {
    fontFamily: fonts.serifItalic,
    fontSize: 38,
    color: '#FFFFFF',
    lineHeight: 38,
    letterSpacing: -0.4,
  },
  heroBtnRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  section: {
    paddingTop: 32,
    paddingHorizontal: screenPadding,
  },
  sectionWide: {
    paddingTop: 32,
  },
  sectionInner: {
    paddingHorizontal: screenPadding,
  },

  categoryGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryCell: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  categoryImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  categoryLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm,
  },

  comboRail: {
    paddingHorizontal: screenPadding,
    paddingBottom: 6,
    gap: 14,
  },
  comboCardWrap: {
    width: 320,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    rowGap: 22,
  },
  gridItem: {
    width: '48%',
    flexGrow: 1,
  },

  flashHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  flashEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  flashTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['5xl'],
  },
  allLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  allLinkText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  flashRail: {
    paddingHorizontal: screenPadding,
    gap: 12,
  },

  bestList: { gap: 14 },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 8,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  bestRank: {
    fontFamily: fonts.serifItalic,
    fontSize: 24,
    width: 24,
    textAlign: 'center',
  },
  bestImage: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  bestInfo: { flex: 1, minWidth: 0, gap: 2 },
  bestBrand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  bestName: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.base,
    marginBottom: 2,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  callout: {
    borderRadius: radius.lg,
    padding: 28,
    overflow: 'hidden',
    ...shadows.md,
  },
  calloutEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 2,
    marginBottom: 12,
  },
  calloutTitle: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 30,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  calloutBtnRow: {
    flexDirection: 'row',
  },
});
