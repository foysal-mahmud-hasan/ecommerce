import { StyleSheet } from 'react-native';
import { radius, fonts, fontSize } from '../../theme';

export const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontFamily: fonts.sansSemiBold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
