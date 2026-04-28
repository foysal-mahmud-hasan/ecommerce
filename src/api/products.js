import { featureFlags } from '../config/featureFlags';

// Mock-first. Reads from the in-memory productsCache that BootstrapProvider
// already loaded. Real impl will hit a paginated endpoint later.

export async function listProducts({ productsCache, params = {} }) {
  if (featureFlags.useRealProductsApi) {
    throw new Error('Real products API not wired yet');
  }
  let list = productsCache?.all || [];
  if (params.categoryId) {
    list = productsCache.byCategoryId[String(params.categoryId)] || [];
  }
  if (params.q) {
    const q = String(params.q).toLowerCase().trim();
    if (q) list = list.filter((p) => p._search.includes(q));
  }
  if (params.sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
  else if (params.sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
  else if (params.sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  const page = params.page ?? 0;
  const pageSize = params.pageSize ?? 40;
  const start = page * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
    hasMore: start + pageSize < list.length,
  };
}

export async function getProduct({ productsCache, id }) {
  if (featureFlags.useRealProductsApi) {
    throw new Error('Real products API not wired yet');
  }
  return productsCache?.byId?.[String(id)] || null;
}
