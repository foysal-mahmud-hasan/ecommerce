import AsyncStorage from '@react-native-async-storage/async-storage';

const NS = 'frag:v1';

export const storageKeys = {
  tenant: `${NS}:tenant`,
  // splash key bumped to v2 after image base URL changed (storage prefix). v1
  // caches contained pre-fix URLs that 404 — rotate so users re-fetch.
  splash: (tenantId) => `${NS}:${tenantId}:splash_v2`,
  cart: (tenantId) => `${NS}:${tenantId}:cart`,
  wishlist: (tenantId) => `${NS}:${tenantId}:wishlist`,
  auth: (tenantId) => `${NS}:${tenantId}:auth`,
  orders: (tenantId) => `${NS}:${tenantId}:orders`,
  prescriptions: (tenantId) => `${NS}:${tenantId}:prescriptions`,
  credentials: `${NS}:credentials`,
};

export async function getJSON(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export async function remove(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Wipe every key tied to a specific tenant (cart, wishlist, auth, orders,
// splash). Called when user signs in to a different store.
export async function clearTenant(tenantId) {
  if (!tenantId) return;
  const keys = [
    storageKeys.splash(tenantId),
    storageKeys.cart(tenantId),
    storageKeys.wishlist(tenantId),
    storageKeys.auth(tenantId),
    storageKeys.orders(tenantId),
  ];
  try {
    await AsyncStorage.multiRemove(keys);
  } catch {
    // best-effort
  }
}
