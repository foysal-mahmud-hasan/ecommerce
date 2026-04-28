import { request } from './client';
import { getJSON, setJSON, storageKeys } from './storage';
import {
  API_BASE_URL,
  API_ECOMMERCE_PATH,
  IMAGE_BASE_URL,
  detectTenantId,
  TENANT_RESTAURANT,
} from '../config/tenants';
import { restaurantSplashMock } from '../data/restaurantMock';

const SPLASH_TTL_MS = 24 * 60 * 60 * 1000;

// Normalize a raw API product into the shape consumed by the UI. The original
// app's ProductCard reads {id, name, price, was, brand, palette, rating, ...},
// so we map API fields to those plus keep the raw record under `_raw` for
// PDP-level details.
function normalizeProduct(p) {
  const name = p.product_name || p.name || 'Untitled';
  const price = Number(p.sales_price ?? p.price ?? 0);
  const wasMaybe = Number(p.price ?? 0);
  // Only show strikethrough if sales_price is meaningfully lower than price.
  const was = wasMaybe > price ? wasMaybe : null;
  const featureImage = p.feature_image
    ? (p.feature_image.startsWith('http') ? p.feature_image : `${IMAGE_BASE_URL}${p.feature_image}`)
    : null;
  return {
    id: String(p.id),
    productId: p.product_id ?? p.id,
    stockId: p.stock_id ?? p.id,
    name,
    brand: p.category || '',
    cat: p.category_id ? String(p.category_id) : '',
    categoryId: p.category_id,
    categoryName: p.category || '',
    price,
    was,
    image: featureImage,
    unit: p.unit_name || 'Pcs',
    unitId: p.unit_id,
    stock: typeof p.quantity === 'number' ? p.quantity : 0,
    measurements: Array.isArray(p.measurements) ? p.measurements : [],
    barcode: p.barcode || '',
    slug: p.slug || '',
    rating: typeof p.rating === 'number' ? p.rating : 4.5,
    reviews: typeof p.reviews === 'number' ? p.reviews : 0,
    description: p.description || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    palette: Array.isArray(p.palette) && p.palette.length === 2 ? p.palette : null,
    _search: name.toLowerCase(),
    _raw: p,
  };
}

function normalizeCategory(c) {
  return {
    id: String(c.id),
    name: c.name || '',
    slug: c.slug || String(c.id),
    item: typeof c.item === 'number' ? c.item : 0,
  };
}

function indexProducts(list) {
  const all = [];
  const byId = {};
  const byCategoryId = {};
  for (const raw of list) {
    const p = normalizeProduct(raw);
    all.push(p);
    byId[p.id] = p;
    const ck = String(p.categoryId);
    if (!byCategoryId[ck]) byCategoryId[ck] = [];
    byCategoryId[ck].push(p);
  }
  return { all, byId, byCategoryId };
}

function buildPayload(rawData, tenantId) {
  const dc = rawData.domain_config || {};
  const currency = dc.inventory_config?.currency || { code: 'BDT', symbol: '৳' };
  return {
    tenant: {
      id: tenantId,
      businessModelId: dc.business_model_id ?? null,
      name: dc.company_name || dc.name || 'Store',
      currency,
      domainConfig: dc,
    },
    categories: (rawData.category || []).map(normalizeCategory),
    productsCache: indexProducts(rawData.product || []),
  };
}

function buildUrl(credentials) {
  const params = new URLSearchParams({
    license_key: credentials.license_key,
    active_key: credentials.active_key,
  });
  return `${API_BASE_URL}${API_ECOMMERCE_PATH}?${params.toString()}`;
}

export async function fetchSplashLive(credentials, opts = {}) {
  const url = buildUrl(credentials);
  const json = await request(url, { timeoutMs: opts.timeoutMs ?? 20000 });
  if (!json || json.status !== 200 || !json.data) {
    throw new Error('Unexpected splash payload shape');
  }
  const tenantId = detectTenantId(json.data.domain_config);
  return buildPayload(json.data, tenantId);
}

// Restaurant tenant has no real backend yet — return shaped mock data.
async function fetchSplashMock() {
  // Wrap restaurantSplashMock through the same normalizer for consistency.
  return buildPayload(restaurantSplashMock, TENANT_RESTAURANT);
}

export async function loadCachedSplash(tenantId) {
  if (!tenantId) return null;
  const cached = await getJSON(storageKeys.splash(tenantId));
  if (!cached || !cached.fetchedAt || !cached.payload) return null;
  const fresh = Date.now() - cached.fetchedAt < SPLASH_TTL_MS;
  return { payload: cached.payload, fresh, fetchedAt: cached.fetchedAt };
}

export async function persistSplash(tenantId, payload) {
  if (!tenantId) return;
  await setJSON(storageKeys.splash(tenantId), { fetchedAt: Date.now(), payload });
}

// Top-level resolver used by BootstrapProvider. Knows nothing about state;
// callers decide whether to use mock vs real based on tenant credentials.
export async function fetchSplash({ credentials, useMock }) {
  if (useMock) return fetchSplashMock();
  return fetchSplashLive(credentials);
}
