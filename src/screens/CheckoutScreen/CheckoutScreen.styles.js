import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: screenPadding },
  stepper: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 0,
    paddingBottom: 20,
  },
  stepCol: { flex: 1 },
  stepBar: { height: 3, borderRadius: 2 },
  stepLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    marginTop: 6,
    letterSpacing: 0.8,
  },

  field: { marginBottom: 12 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
  },
  fieldError: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    marginLeft: 8,
  },
  input: {
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: radius.sm,
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
  },
  fieldRow: { flexDirection: 'row', gap: 10 },
  fieldCity: { flex: 1.4 },
  fieldZip: { flex: 1 },
  fieldHalf: { flex: 1 },

  shipOpt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderRadius: radius.md,
  },
  shipOptText: { flex: 1, minWidth: 0 },
  shipOptLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.lg,
  },
  shipOptSub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  shipOptPrice: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.lg,
  },
  encRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  encText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },

  summary: {
    marginTop: 24,
    padding: 18,
    borderRadius: radius.md,
  },
  summaryEyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 1.4,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    gap: 12,
  },
  summaryItem: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },
  summaryMore: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    paddingVertical: 4,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 10,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTotalLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.xl,
  },

  bottomBar: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});
