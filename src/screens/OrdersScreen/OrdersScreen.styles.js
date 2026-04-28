import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  tabsRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: screenPadding,
    paddingTop: 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  list: {
    paddingHorizontal: screenPadding,
    paddingTop: 18,
    gap: 14,
  },
  empty: {
    paddingVertical: 40,
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
  },
  card: {
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 1.4,
    marginBottom: 3,
  },
  orderDate: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  thumbCount: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  cardTotal: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.lg,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trackText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
});
