import { Platform, StyleSheet } from 'react-native';
import { fonts, fontSize, radius } from '../../../theme';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    fontFamily: fonts.sans,
    paddingVertical: 0,
    minHeight: 22,
    ...(Platform.OS === 'web'
      ? { outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' }
      : {}),
  },
  clearBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsWrap: {
    marginTop: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  spotlight: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 12 }),
  },
  resultsScroll: {
    paddingVertical: 4,
  },
  emptyRow: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },

  resultRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  resultImage: {
    width: 52,
    height: 52,
  },
  resultInfo: { flex: 1, gap: 2 },
  resultBrand: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  resultName: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },
  resultPriceRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'baseline',
  },
  resultPrice: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.md,
  },
  resultStock: {
    fontFamily: fonts.mono,
    fontSize: 9,
  },
  divider: {
    height: 1,
    marginHorizontal: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
  },
  footerText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.md,
  },
});
