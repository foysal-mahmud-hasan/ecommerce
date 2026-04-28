import { StyleSheet } from 'react-native';
import { radius, fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  chip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: fontSize.md,
    fontFamily: fonts.sansMedium,
    letterSpacing: 0.2,
  },
});
