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

function normalizeMeasurement(m) {
  if (!m || typeof m !== 'object') return null;
  // tag-products returns "unit name" (with space); detail returns unit_name.
  const unitName = m.unit_name ?? m['unit name'] ?? '';
  return {
    id: m.id != null ? String(m.id) : null,
    unitId: m.unit_id ?? null,
    unitName,
    slug: m.slug || '',
    isBaseUnit: !!m.is_base_unit,
    isSales: m.is_sales == null ? true : !!m.is_sales,
    isPurchase: !!m.is_purchase,
    quantity: Number(m.quantity ?? 0),
    salesPrice: Number(m.sales_price ?? 0),
    raw: m,
  };
}

// Normalize a raw API product into the shape consumed by the UI. Handles two
// shapes from the live backend:
//   - LIST  (category-products, tag-products): {id, product_name, unit_name,
//     category_name, category_id, feature_image, price (=selling),
//     stock_quantity, measurements:[]}
//   - DETAIL (details-product): {id, stock_id, product_id, product_name,
//     category (name), category_id, unit_name, quantity (=stock),
//     price (=cost), sales_price (=selling), barcode, measurements:[…]}
// The `id` field on both shapes IS the stock_id — that's what details-product
// expects. Keep raw under `_raw` for PDP-level details.
export function normalizeProduct(p) {
  if (!p || typeof p !== 'object') return null;
  const name = p.product_name || p.name || 'Untitled';
  // sales_price (detail) or price (list) is the selling price the user pays.
  const selling = Number(p.sales_price ?? p.price ?? 0);
  // For "was" / strikethrough we ONLY trust list-shape: when both a list
  // `price` and a smaller `sales_price` are present. Detail's `price` is the
  // cost price and must never be shown as a strikethrough.
  let was = null;
  if (p.sales_price != null && p.price != null) {
    const list = Number(p.price);
    if (list > selling) was = list;
  }
  const rawImage = typeof p.feature_image === 'string' ? p.feature_image.trim() : '';
  let featureImage = null;
  if (rawImage) {
    if (rawImage.startsWith('http://') || rawImage.startsWith('https://')) {
      featureImage = rawImage;
    } else {
      const base = IMAGE_BASE_URL.replace(/\/+$/, '');
      const path = rawImage.replace(/^\/+/, '');
      featureImage = `${base}/${path}`;
    }
  }
  const brand = p.category || p.category_name || '';
  const stock = Number(p.quantity ?? p.stock_quantity ?? 0);
  const measurements = Array.isArray(p.measurements)
    ? p.measurements.map(normalizeMeasurement).filter(Boolean)
    : [];
  return {
    // `id` IS the stock_id on full list/detail shapes. Splash tag stubs omit
    // `id` and carry only stock_id/product_id, so fall back to those — keeping
    // a stub's id equal to the full product's id so they de-dupe and route to
    // the same PDP.
    id: String(p.id ?? p.stock_id ?? p.product_id ?? ''),
    productId: p.product_id ?? p.id,
    stockId: p.stock_id ?? p.id,
    name,
    brand,
    cat: p.category_id ? String(p.category_id) : '',
    categoryId: p.category_id,
    categoryName: brand,
    price: selling,
    was,
    image: featureImage,
    unit: p.unit_name || 'Pcs',
    unitId: p.unit_id,
    stock,
    measurements,
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

// Tag groups from splash come as {tag_id, tag_name, products:[stub,…]}.
// `products` are stubs (often partial) that act as a hint of what's in the
// tag — we still hit /tag-products/{id} for the real list. Keep stubs around
// so the home rails can render skeleton-ish placeholders before the fetch
// resolves if we ever want to.
export function normalizeTag(t) {
  if (!t || typeof t !== 'object') return null;
  return {
    id: String(t.tag_id ?? t.id ?? ''),
    name: t.tag_name || t.name || '',
    // Normalized products that came inline with the splash tag. The home rails
    // render these immediately (one rail per tag, titled by tag_name) and
    // upgrade to the full /tag-products/{id} list once the warm-up resolves.
    products: (Array.isArray(t.products) ? t.products : [])
      .map(normalizeProduct)
      .filter(Boolean),
  };
}

function indexProducts(list) {
  const all = [];
  const byId = {};
  const byCategoryId = {};
  for (const raw of list) {
    const p = normalizeProduct(raw);
    if (!p) continue;
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
  // The live splash no longer returns a `product` array — products are loaded
  // lazily via the per-tag / per-category / per-detail endpoints. The mock
  // splash for the restaurant tenant still bundles products, so we keep
  // indexProducts working for that path.
  return {
    tenant: {
      id: tenantId,
      businessModelId: dc.business_model_id ?? null,
      name: dc.company_name || dc.name || 'Store',
      currency,
      domainConfig: dc,
    },
    categories: (rawData.category || []).map(normalizeCategory),
    tags: (rawData.tags || []).map(normalizeTag).filter(Boolean),
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
