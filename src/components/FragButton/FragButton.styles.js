import { StyleSheet } from 'react-native';
import { radius, fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    gap: 8,
  },
  full: { alignSelf: 'stretch', flex: 1 },
  size_sm: { height: 34, paddingHorizontal: 14 },
  size_md: { height: 44, paddingHorizontal: 20 },
  size_lg: { height: 52, paddingHorizontal: 24 },
  text_sm: { fontSize: fontSize.base },
  text_md: { fontSize: fontSize.lg },
  text_lg: { fontSize: 15 },
  label: {
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.2,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
