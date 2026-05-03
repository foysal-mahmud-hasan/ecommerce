// Stable partition: in-stock items first, out-of-stock last.
// Restaurant mock items hardcode stock: 999, so they always pass.
// Pharma API items use real stock counts. Items missing the field
// (defensive) are treated as out-of-stock.
export function sortInStockFirst(list) {
  if (!Array.isArray(list) || list.length === 0) return list || [];
  const inStock = [];
  const outOfStock = [];
  for (const p of list) {
    if ((p?.stock ?? 0) > 0) inStock.push(p);
    else outOfStock.push(p);
  }
  return inStock.concat(outOfStock);
}

export function isInStock(product) {
  return (product?.stock ?? 0) > 0;
}

// True when a product is sold in more than one unit (e.g. Strip + Box). The
// quick-view modal opens for these so the user can pick a unit + qty per row;
// single-unit products skip the modal and add directly to cart.
export function hasMultipleSaleableUnits(product) {
  const m = Array.isArray(product?.measurements) ? product.measurements : [];
  const saleable = m.filter((x) => x.is_sales === 1 || x.is_sales === undefined);
  return saleable.length > 1;
}
