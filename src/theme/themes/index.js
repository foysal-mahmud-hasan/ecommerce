import { pharmaTheme } from './pharma';
import { restaurantTheme } from './restaurant';
import { TENANT_PHARMA, TENANT_RESTAURANT, FALLBACK_TENANT } from '../../config/tenants';

export const themesByTenant = {
  [TENANT_PHARMA]: pharmaTheme,
  [TENANT_RESTAURANT]: restaurantTheme,
};

export function getThemeFor(tenantId) {
  return themesByTenant[tenantId] || themesByTenant[FALLBACK_TENANT];
}
