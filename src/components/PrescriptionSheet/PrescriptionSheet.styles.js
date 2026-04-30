import { StyleSheet, Platform } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize['4xl'],
    lineHeight: 30,
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    lineHeight: 18,
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 18,
  },
  uploadHint: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },
  preview: {
    width: '100%',
    aspectRatio: 1.4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    marginBottom: 14,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {}),
  },
  submitBtn: {
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginTop: 10,
    textAlign: 'center',
  },
});
