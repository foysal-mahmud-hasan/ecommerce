import { StyleSheet } from 'react-native';
import { fonts, fontSize, radius, screenPadding } from '../../theme';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    paddingHorizontal: screenPadding,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 24,
    borderRadius: radius.lg,
    marginBottom: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#fff',
    fontFamily: fonts.serifItalic,
    fontSize: fontSize['3xl'],
  },
  profileText: { flex: 1, minWidth: 0 },
  profileName: {
    fontFamily: fonts.serif,
    fontSize: fontSize['3xl'],
    lineHeight: 24,
  },
  profileSub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  statValue: {
    fontFamily: fonts.serif,
    fontSize: fontSize['3xl'],
  },
  statLabel: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  menu: {
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  menuLabel: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
  },
  version: {
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    marginTop: 32,
  },
});
