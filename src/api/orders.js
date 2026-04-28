import { featureFlags } from '../config/featureFlags';

// Mock checkout — generates an order id, returns the persisted shape.
// StoreContext is responsible for prepending it to the orders list.
export async function placeOrder({ items, address, payment, currency }) {
  if (featureFlags.useRealOrdersApi) throw new Error('Real orders API not wired');
  if (!items || items.length === 0) throw new Error('Cart is empty');
  if (!address?.phone || !address?.line1) throw new Error('Address required');
  await new Promise((r) => setTimeout(r, 400)); // simulate network

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const order = {
    id: `o_${Date.now().toString(36)}`,
    placedAt: Date.now(),
    status: 'placed',
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
    currency,
    subtotal,
    total: subtotal,
  };
  return order;
}
