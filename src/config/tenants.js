// Maps domain_config.business_model_id → tenant id.
// 9 = Epharma (the only id we know today). Future restaurant id will go here.
// Unknown ids fall back to pharma so the app never renders unthemed.
export const TENANT_PHARMA = 'pharma';
export const TENANT_RESTAURANT = 'restaurant';

const businessModelMap = {
  9: TENANT_PHARMA,
  // 10: TENANT_RESTAURANT, // populate when backend assigns one
};

export const FALLBACK_TENANT = TENANT_PHARMA;

export function detectTenantId(domainConfig) {
  if (!domainConfig) return FALLBACK_TENANT;
  const id = domainConfig.business_model_id;
  return businessModelMap[id] || FALLBACK_TENANT;
}

// Default credentials Bootstrap uses on first cold start (before user enters
// their own via the tenant-switch screen). Real production builds would inject
// these via EXPO_PUBLIC_* env vars.
export const DEFAULT_CREDENTIALS = {
  license_key: '01828148148',
  active_key: '0123456789',
};

export const API_BASE_URL = 'https://backend.epharmabd.com';
export const API_ECOMMERCE_PATH = '/api/pos/ecommerce';
// Image base — feature_image fields are returned as paths relative to the
// Laravel storage disk (e.g. "uploads/inventory/product/feature_image/x.png").
// Backend exposes that disk under `/storage/` (verified — other prefixes 404).
export const IMAGE_BASE_URL = 'https://backend.epharmabd.com/storage/';

export const TENANT_LABELS = {
  [TENANT_PHARMA]: 'Pharmacy',
  [TENANT_RESTAURANT]: 'Restaurant',
};
