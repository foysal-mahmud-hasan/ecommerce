import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: {
    paddingHorizontal: screenPadding,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['5xl'],
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyBtnRow: { flexDirection: 'row' },

  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: 4,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    marginBottom: 16,
  },
  list: { gap: 14 },
  row: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  imgBox: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  info: { flex: 1, minWidth: 0, gap: 3 },
  brand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  name: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.base,
  },
  variant: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyNum: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
    minWidth: 14,
    textAlign: 'center',
  },
  lineTotal: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.lg,
  },

  totalsCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: radius.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },
  totalValue: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },
  grandLabel: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.xl,
  },
  grandValue: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.xl,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  shipNote: {
    marginTop: 12,
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },

  bottomBar: {
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});
