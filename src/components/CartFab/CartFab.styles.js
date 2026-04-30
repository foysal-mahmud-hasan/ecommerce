import { StyleSheet } from 'react-native';
import { fonts, fontSize, shadows } from '../../theme';

export const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
    elevation: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 999,
    ...shadows.lg,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
  },
  total: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize.md,
  },
  cta: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  divider: {
    width: 1,
    height: 22,
  },
});
