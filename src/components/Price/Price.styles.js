import { StyleSheet } from 'react-native';
import { fonts } from '../../theme';

// Dynamic factory because price size varies (13/14/22/26).
export function makeStyles(size, bold) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 8,
    },
    price: {
      fontFamily: bold ? fonts.sansSemiBold : fonts.sans,
      fontSize: size,
    },
    was: {
      fontFamily: fonts.sans,
      fontSize: Math.max(size - 1, 10),
      textDecorationLine: 'line-through',
    },
  });
}
