import { createContext } from 'react';
import { FALLBACK_TENANT } from '../config/tenants';

// Tiny dedicated context. Separate from StoreContext so theme consumers
// don't re-render on every cart/wishlist update.
export const TenantContext = createContext({
  tenantId: FALLBACK_TENANT,
  tenant: null, // full {id, businessModelId, name, currency, domainConfig}
});
