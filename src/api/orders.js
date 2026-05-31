import { request, ApiError } from './client';
import { buildApiHeaders } from './headers';
import { API_ECOMMERCE_BASE } from '../config/tenants';

// Order placement: the live backend exposes NO create-order endpoint
// (verified against the current Postman collection). Until it does, we keep
// `placeOrder` as a local, in-memory operation — the StoreContext prepends
// the result to its orders list. Only order *history* is live (fetchOrders).

export async function placeOrder({
  id,
  items,
  address,
  payment,
  gateway,
  paymentStatus,
  transactionId,
  currency,
}) {
  if (!items || items.length === 0) throw new Error('Cart is empty');
  if (!address?.phone || !address?.line1) throw new Error('Address required');
  await new Promise((r) => setTimeout(r, 200));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: id || `o_${Date.now().toString(36)}`,
    placedAt: Date.now(),
    status: paymentStatus || 'placed',
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      qty: i.qty,
      price: i.price,
      unit: i.unit,
      image: i.image,
    })),
    address,
    payment,
    gateway: gateway || payment,
    transactionId: transactionId || null,
    currency,
    subtotal,
    total: subtotal,
  };
  return order;
}

// Live order history. The response groups orders by `process` (Approved /
// Confirmed / etc.); we flatten and re-expose the group key as `status`.
// Empty user → backend returns `data: []` rather than `data: {}`.
export async function fetchOrders({ credentials, userId, signal }) {
  if (!credentials) throw new ApiError('http', 0, 'Missing credentials');
  if (userId == null || userId === '') throw new ApiError('http', 0, 'Missing userId');
  const url = `${API_ECOMMERCE_BASE}/orders`;
  const json = await request(url, {
    headers: buildApiHeaders(credentials, { userId }),
    signal,
  });
  if (!json || json.status !== 200) {
    throw new ApiError('http', json?.status ?? 0, json?.message || 'Could not fetch orders');
  }
  const data = json.data;
  const flat = [];
  if (Array.isArray(data)) {
    // Empty / null user shape.
  } else if (data && typeof data === 'object') {
    for (const [groupKey, list] of Object.entries(data)) {
      if (!Array.isArray(list)) continue;
      for (const raw of list) flat.push(normalizeOrder(raw, groupKey));
    }
  }
  // Backend has no chronological cursor — order newest-first by parsed date.
  flat.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
  return { orders: flat, total: json.total ?? flat.length, raw: json };
}

// Date arrives as "DD-MM-YYYY". Parse defensively; if it doesn't match,
// fall back to 0 so we don't break sorting.
function parseBackendDate(s) {
  if (!s || typeof s !== 'string') return 0;
  const m = s.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!m) return 0;
  const [, dd, mm, yyyy] = m;
  const t = Date.parse(`${yyyy}-${mm}-${dd}T00:00:00Z`);
  return Number.isFinite(t) ? t : 0;
}

function normalizeOrder(o, groupKey) {
  const items = Array.isArray(o.sales_items) ? o.sales_items : [];
  return {
    id: String(o.id ?? o.invoice ?? `${groupKey}_${Math.random().toString(36).slice(2, 8)}`),
    invoice: o.invoice || '',
    status: o.process || groupKey || 'Pending',
    createdAt: o.created || '',
    placedAt: parseBackendDate(o.created),
    subtotal: Number(o.sub_total ?? 0),
    total: Number(o.total ?? o.sub_total ?? 0),
    payment: o.payment || '',
    discount: Number(o.discount ?? 0),
    discountType: o.discount_type || '',
    customerName: o.customer_name || '',
    customerMobile: o.customer_mobile || '',
    items: items.map((it) => ({
      productId: it.product_id ?? null,
      name: it.product_name || '',
      qty: Number(it.quantity ?? 0),
      bonusQty: Number(it.bonus_quantity ?? 0),
      unit: it.uom || '',
      price: Number(it.sales_price ?? it.price ?? 0),
      subtotal: Number(it.sub_total ?? 0),
    })),
    raw: o,
  };
}
