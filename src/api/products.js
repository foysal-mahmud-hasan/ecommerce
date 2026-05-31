import { request, ApiError } from './client';
import { buildApiHeaders } from './headers';
import { normalizeProduct } from './splash';
import { API_ECOMMERCE_BASE } from '../config/tenants';

// All product fetches use the X-Api-* header auth scheme. The backend ignores
// pagination params today (see plan), so `page` is reserved for forward-compat.

function unwrapList(json) {
  if (!json || json.status !== 200 || !json.data) {
    throw new ApiError('parse', json?.status ?? 0, 'Unexpected list payload');
  }
  const products = Array.isArray(json.data.products) ? json.data.products : [];
  const pagination = json.data.pagination || null;
  return {
    items: products.map(normalizeProduct).filter(Boolean),
    pagination,
  };
}

export async function getCategoryProducts({ credentials, categoryId, page = 1, signal }) {
  if (!credentials) throw new ApiError('http', 0, 'Missing credentials');
  if (categoryId == null) throw new ApiError('http', 0, 'Missing categoryId');
  const url = `${API_ECOMMERCE_BASE}/category-products/${encodeURIComponent(
    String(categoryId),
  )}?page=${page}`;
  const json = await request(url, { headers: buildApiHeaders(credentials), signal });
  return unwrapList(json);
}

export async function getTagProducts({ credentials, tagId, page = 1, signal }) {
  if (!credentials) throw new ApiError('http', 0, 'Missing credentials');
  if (tagId == null) throw new ApiError('http', 0, 'Missing tagId');
  const url = `${API_ECOMMERCE_BASE}/tag-products/${encodeURIComponent(
    String(tagId),
  )}?page=${page}`;
  const json = await request(url, { headers: buildApiHeaders(credentials), signal });
  return unwrapList(json);
}

export async function getProductDetail({ credentials, stockId, signal }) {
  if (!credentials) throw new ApiError('http', 0, 'Missing credentials');
  if (stockId == null) throw new ApiError('http', 0, 'Missing stockId');
  const url = `${API_ECOMMERCE_BASE}/details-product/${encodeURIComponent(String(stockId))}`;
  const json = await request(url, { headers: buildApiHeaders(credentials), signal });
  if (!json || json.status !== 200) return null;
  const data = json.data;
  if (!data) return null;
  return normalizeProduct(data);
}
