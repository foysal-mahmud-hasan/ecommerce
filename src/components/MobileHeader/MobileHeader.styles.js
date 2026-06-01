import { StyleSheet } from 'react-native';
import { fonts, fontSize, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  // Desktop/web page heading: left-aligned title on the page background,
  // no back arrow, no surface bar. Right slot (toggles, actions) stays right.
  webWrap: {
    paddingHorizontal: screenPadding,
    paddingTop: 28,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  webTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize['4xl'],
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  spacer: { width: 36 },
  flex1: { flex: 1 },
  rightBox: {
    width: 36,
    alignItems: 'flex-end',
  },
  titleSerif: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.serif,
    fontSize: fontSize['2xl'],
  },
  titleSans: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.sansSemiBold,
    fontSize: 15,
  },
});
