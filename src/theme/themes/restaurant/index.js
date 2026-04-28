import { restaurantColors } from './colors';
import { restaurantFonts } from './typography';
import { restaurantLayout } from './layout';

export const restaurantTheme = {
  ...restaurantColors,
  fonts: restaurantFonts,
  ...restaurantLayout,
};
