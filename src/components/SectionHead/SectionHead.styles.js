import { StyleSheet } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleCol: { flexShrink: 1 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xs,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  titleSerif: {
    fontFamily: fonts.serif,
    fontSize: 28,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  titleSans: {
    fontFamily: fonts.sansSemiBold,
    fontSize: fontSize['2xl'],
    letterSpacing: -0.1,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    paddingBottom: 1,
    borderBottomWidth: 1,
  },
});
