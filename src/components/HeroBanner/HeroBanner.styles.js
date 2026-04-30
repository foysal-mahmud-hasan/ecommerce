import { StyleSheet } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.34)',
  },
  overlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  content: {
    position: 'absolute',
    left: 22,
    right: 22,
    bottom: 22,
    top: 22,
    justifyContent: 'flex-end',
    gap: 4,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize['3xl'],
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    lineHeight: 18,
    marginTop: 2,
  },
  ctaRow: {
    marginTop: 14,
    flexDirection: 'row',
  },
  ctaBtn: {
    paddingHorizontal: 18,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 12,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
