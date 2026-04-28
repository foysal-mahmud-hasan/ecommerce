import { StyleSheet } from 'react-native';
import { fonts, fontSize, shadows } from '../../theme';

export const styles = StyleSheet.create({
  imageWrap: {
    position: 'relative',
  },
  badgeBox: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  heart: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  body: {
    paddingTop: 12,
    paddingHorizontal: 2,
  },
  brand: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.lg,
    lineHeight: 18,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
