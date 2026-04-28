import { useContext } from 'react';
import { fragLight, fragDark, swatchPalette } from './colors';
import { spacing, space, screenPadding } from './spacing';
import { fonts, fontSize } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';
import { layout, breakpoints } from './layout';
import { getThemeFor } from './themes';
import { FALLBACK_TENANT } from '../config/tenants';
import { TenantContext } from '../store/TenantContext';

export {
  fragLight,
  fragDark,
  swatchPalette,
  spacing,
  space,
  screenPadding,
  fonts,
  fontSize,
  radius,
  shadows,
  layout,
  breakpoints,
};

// Tenant-aware. Reads the current tenant id from TenantContext (a tiny
// dedicated context, separate from StoreContext, so theme works during
// bootstrap before the store is fully populated). Defaults to pharma when
// the context isn't available — covers the brief window in app/_layout.js
// before BootstrapProvider mounts.
export function useTheme() {
  const ctx = useContext(TenantContext);
  const tenantId = ctx?.tenantId || FALLBACK_TENANT;
  return getThemeFor(tenantId);
}
