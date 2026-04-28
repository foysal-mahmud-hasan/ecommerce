import { pharmaColors } from './colors';
import { pharmaFonts } from './typography';
import { pharmaLayout } from './layout';

export const pharmaTheme = {
  ...pharmaColors,
  fonts: pharmaFonts,
  ...pharmaLayout,
};
