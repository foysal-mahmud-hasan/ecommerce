export const layout = {
  tabBarHeight: 64,
  buyBarHeight: 76,
  // Height of the web/desktop top navigation bar (DesktopTopNav). Shown only
  // on web ≥768; mobile/native uses the bottom tab bar instead.
  topNavHeight: 64,
  // Max content width for the centered desktop shell + page containers.
  // The top nav and all page content share this so their left/right edges
  // line up in one consistent column (no nav-wider-than-content mismatch).
  contentMaxWidth: 1536,
  hitSlop: { top: 8, right: 8, bottom: 8, left: 8 },
};

export const breakpoints = {
  small: 360,
  medium: 390,
  large: 414,
};
