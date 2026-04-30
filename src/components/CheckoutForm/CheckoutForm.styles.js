import { Platform, StyleSheet } from 'react-native';
import { fonts, fontSize, radius } from '../../theme';

export const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  fieldLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
  },
  fieldError: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    marginLeft: 8,
  },
  input: {
    height: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: radius.sm,
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
  },
  fieldRow: { flexDirection: 'row', gap: 10 },
  fieldCity: { flex: 1.4 },
  fieldZip: { flex: 1 },

  shipOpt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderRadius: radius.md,
  },
  shipOptText: { flex: 1, minWidth: 0 },
  shipOptLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.lg },
  shipOptSub: { fontFamily: fonts.sans, fontSize: fontSize.sm, marginTop: 2 },
  encRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  encText: { fontFamily: fonts.sans, fontSize: fontSize.sm },
});
