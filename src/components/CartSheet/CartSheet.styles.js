import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius } from '../../theme';

export const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 14,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize['4xl'],
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  stepperRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
  },
  stepBar: { flex: 1, height: 3, borderRadius: 2 },

  empty: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize['3xl'],
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },

  lineCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: radius.md,
    marginBottom: 10,
  },
  lineImage: {
    width: 64,
    height: 64,
  },
  lineInfo: { flex: 1, gap: 4 },
  lineBrand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  lineName: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },
  lineUnit: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },
  lineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    height: 30,
  },
  qtyText: { fontFamily: fonts.sansSemiBold, fontSize: fontSize.md, minWidth: 16, textAlign: 'center' },
  lineTotal: { fontFamily: fonts.sansSemiBold, fontSize: fontSize.md },
  removeBtn: { padding: 4 },

  totals: {
    marginTop: 8,
    padding: 14,
    borderRadius: radius.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: { fontFamily: fonts.sans, fontSize: fontSize.md },
  totalValue: { fontFamily: fonts.sansMedium, fontSize: fontSize.md },
  divider: { height: 1, marginVertical: 8 },
  grandLabel: { fontFamily: fonts.sansSemiBold, fontSize: fontSize.lg },
  grandValue: { fontFamily: fonts.sansSemiBold, fontSize: fontSize.lg },

  footerBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBtnText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: 0.4,
  },

  successWrap: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 12,
  },
  successCheck: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: fonts.display,
    fontSize: fontSize['4xl'],
    textAlign: 'center',
  },
  successSub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
