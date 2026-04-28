import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding, shadows } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  galleryWrap: { position: 'relative' },
  fab: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  galleryImage: {
    width: '100%',
    aspectRatio: 0.85,
  },
  dotRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },

  info: {
    paddingHorizontal: screenPadding,
    paddingTop: 22,
  },
  brand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: fontSize['5xl'],
    lineHeight: 30,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  dotSep: { fontSize: fontSize.sm },
  metaText: { fontFamily: fonts.sans, fontSize: fontSize.md },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 20,
  },
  aboutBlock: {
    paddingVertical: 18,
    marginBottom: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  aboutText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    lineHeight: 22,
  },
  perkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 14,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  perkText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },
  variantBlock: { marginBottom: 18 },
  variantHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  variantValue: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 4,
  },
  sizeGuide: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    textDecorationLine: 'underline',
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeCell: {
    minWidth: 52,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.base,
  },
  comboBlock: { marginBottom: 24, marginTop: 6 },
  reviewBlock: { marginBottom: 24, marginTop: 8 },
  reviewCard: {
    padding: 18,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 10,
  },
  reviewQuote: {
    fontFamily: fonts.serifItalic,
    fontSize: fontSize.xl,
    lineHeight: 22,
  },
  reviewAuthor: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginTop: 10,
  },
  relatedRail: {
    gap: 12,
    paddingBottom: 24,
    paddingRight: screenPadding,
  },

  buyBar: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  addBtn: { flex: 1 },
  buyBtn: { flex: 1.4 },
});
