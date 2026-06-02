// STOCK IS NOT TRACKED. Per product decision (2026-06-02) the store sells
// every product in any quantity regardless of stock — so these two helpers,
// which are the single gate every product list and Add-to-Cart button funnels
// through, are intentionally neutralized:
//   • sortInStockFirst() returns the list untouched (no hiding, no reordering).
//   • isInStock() always reports true (no OUT badge, no disabled buttons).
// The `hideOutOfStock` option is kept in the signature so callers don't change.
// To re-enable stock handling later, restore the partition/`stock > 0` logic
// here and every consumer lights back up — the OOS UI is still in place behind
// these checks. See decisions.md.
export function sortInStockFirst(list, _opts = {}) {
  return Array.isArray(list) ? list : [];
}

export function isInStock() {
  return true;
}

// True when a product is sold in more than one unit (e.g. Strip + Box). The
// quick-view modal opens for these so the user can pick a unit + qty per row;
// single-unit products skip the modal and add directly to cart.
export function hasMultipleSaleableUnits(product) {
  const m = Array.isArray(product?.measurements) ? product.measurements : [];
  const saleable = m.filter((x) => x.is_sales === 1 || x.is_sales === undefined);
  return saleable.length > 1;
}
