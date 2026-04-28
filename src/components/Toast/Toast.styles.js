import { StyleSheet } from 'react-native';
import { radius, shadows, fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    ...shadows.md,
  },
  text: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
  },
});
