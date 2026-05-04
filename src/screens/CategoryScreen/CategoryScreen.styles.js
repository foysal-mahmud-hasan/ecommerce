import { StyleSheet } from 'react-native';
import { fonts, fontSize, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  combosWrap: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
    gap: 18,
  },
  sortRail: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: screenPadding,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  count: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    paddingHorizontal: screenPadding,
    marginTop: 16,
    marginBottom: 14,
  },
  grid: {
    paddingHorizontal: screenPadding,
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 22,
  },
});
