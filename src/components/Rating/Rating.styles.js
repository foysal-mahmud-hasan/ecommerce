import { StyleSheet } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },
  reviews: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
});
