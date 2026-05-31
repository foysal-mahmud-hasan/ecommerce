// Header helper for the ecommerce sub-resources. Splash uses query params,
// but every other endpoint reads its credentials from these headers. Pass
// userId only for endpoints that require it (currently /orders).
export function buildApiHeaders(credentials, { userId } = {}) {
  const license = credentials?.license_key || '';
  const active = credentials?.active_key || '';
  const headers = {
    'X-Api-License-No': license,
    'X-Api-Active-Key': active,
  };
  if (userId != null && userId !== '') {
    headers['X-Api-User-ID'] = String(userId);
  }
  return headers;
}
