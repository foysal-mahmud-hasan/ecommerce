import { StyleSheet } from 'react-native';
import { fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  box: {
    position: 'relative',
    overflow: 'hidden',
  },
  fit: {
    width: '100%',
    height: '100%',
  },
  svgFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  labelBox: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  labelText: {
    fontFamily: fonts.mono,
    fontSize: fontSize.xxs,
    letterSpacing: 1,
    opacity: 0.65,
    textTransform: 'uppercase',
  },
});
