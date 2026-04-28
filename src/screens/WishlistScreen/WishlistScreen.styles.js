import { StyleSheet } from 'react-native';
import { fonts, fontSize, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: {
    paddingHorizontal: screenPadding,
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['3xl'],
    marginTop: 12,
    marginBottom: 6,
  },
  emptySub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    textAlign: 'center',
  },
  scroll: {
    paddingHorizontal: screenPadding,
    paddingTop: 4,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    rowGap: 22,
  },
  gridItem: { width: '48%' },
});
