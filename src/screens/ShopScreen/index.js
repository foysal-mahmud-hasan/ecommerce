import React from 'react';
import { useTheme } from '../../theme';
import ShopScreenPharma from './ShopScreenPharma';
import ShopScreenRestaurant from './ShopScreenRestaurant';

// Picker — chooses the home screen variant from the active theme's
// `homeVariant` token. Falls back to pharma.
export default function ShopScreen() {
  const t = useTheme();
  if (t.homeVariant === 'restaurant') return <ShopScreenRestaurant />;
  return <ShopScreenPharma />;
}
