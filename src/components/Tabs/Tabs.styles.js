import { StyleSheet } from 'react-native';
import { fontSize } from '../../theme';

export const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    gap: 4,
  },
  tab: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabFlex: {
    flex: 1,
  },
  tabAuto: {
    // Do NOT use `flex: 0` here — on react-native-web that expands to
    // `flex: 0 1 0%`, which sets flex-basis to 0 and collapses the tab to
    // zero width. Omitting flex lets the element size to its content.
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 'auto',
    paddingHorizontal: 18,
  },
  label: {
    fontSize: fontSize.md,
    letterSpacing: 0.2,
    paddingBottom: 4,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -1,
    height: 2,
    borderRadius: 2,
  },
});
