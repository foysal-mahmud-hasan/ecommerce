import { StyleSheet } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  wrap: { flexShrink: 0 },
  imageBox: { position: 'relative' },
  badge: { position: 'absolute', top: 6, left: 6 },
  body: { marginTop: 8 },
  name: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
    lineHeight: 16,
  },
  priceRow: { marginTop: 4 },
});
