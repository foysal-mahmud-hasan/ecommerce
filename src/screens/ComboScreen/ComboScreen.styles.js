import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: {
    paddingHorizontal: screenPadding,
    paddingBottom: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 2,
    marginBottom: 12,
  },
  heroTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['8xl'],
    color: '#fff',
    lineHeight: 42,
    letterSpacing: -0.4,
  },
  heroTagline: {
    fontFamily: fonts.serifItalic,
    color: '#cbc1b1',
    fontSize: fontSize.lg,
    marginTop: 8,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 14,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  savingsCol: { gap: 4 },
  flex1: { flex: 1 },
  savingsLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
  },
  savingsBig: {
    fontFamily: fonts.sansSemiBold,
    color: '#fff',
    fontSize: fontSize['4xl'],
  },
  savingsStrike: {
    fontFamily: fonts.sans,
    fontSize: 15,
    textDecorationLine: 'line-through',
  },
  savePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  savePillText: {
    color: '#fff',
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.md,
  },

  section: {
    paddingHorizontal: screenPadding,
    paddingTop: 28,
  },
  builderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['3xl'],
    marginTop: 6,
  },
  resetBtn: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  slotList: { gap: 10 },
  slot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  slotImage: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  slotInfo: { flex: 1, minWidth: 0, gap: 3 },
  slotBrand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  slotName: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.lg,
  },
  slotPrice: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  swapBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },

  previewBlock: {
    marginTop: 24,
    padding: 16,
    borderRadius: radius.md,
  },
  layoutChips: {
    flexDirection: 'row',
    gap: 6,
  },
  previewCard: { marginTop: 16 },

  perksCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  perkText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  bottomBarLeft: { flex: 1, minWidth: 0 },
  bottomLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },
  bottomPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  bottomPrice: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize['2xl'],
  },
  bottomWas: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    textDecorationLine: 'line-through',
  },
  bottomBtn: { flexShrink: 0 },

  sheetHandle: { paddingVertical: 8 },
  sheetContent: {
    paddingHorizontal: screenPadding,
    paddingBottom: 60,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sheetClose: { padding: 8 },
  sheetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    rowGap: 18,
  },
  sheetGridItem: { width: '48%' },
});
