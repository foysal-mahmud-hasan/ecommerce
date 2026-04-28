// formatPrice reads symbol/position/decimals from a currency object so
// per-tenant formatting works without hardcoding ৳ vs $.
const DEFAULT_CURRENCY = { code: 'USD', symbol: '$', position: 'before', decimals: 0 };

export function formatPrice(value, currency = DEFAULT_CURRENCY) {
  const c = currency || DEFAULT_CURRENCY;
  const symbol = c.symbol || '$';
  const decimals = typeof c.decimals === 'number' ? c.decimals : 0;
  const n = Number(value) || 0;
  const formatted = n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (c.position === 'after') return `${formatted}${symbol}`;
  return `${symbol}${formatted}`;
}

export function percentOff(price, was) {
  if (!was || was <= price) return 0;
  return Math.round((1 - price / was) * 100);
}
