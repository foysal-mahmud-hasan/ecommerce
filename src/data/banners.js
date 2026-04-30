// Mock hero banners per tenant. Designer can swap images / copy any time.
// Image URLs use Unsplash (same approach as restaurant product mock).
// `kind` is informational — drives the eyebrow label.

export const bannersByTenant = {
  pharma: [
    {
      id: 'pb1',
      kind: 'offer',
      title: 'Free delivery on orders over ৳500',
      subtitle: 'Same-day in Dhaka. No promo code needed.',
      image:
        'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Shop now',
      ctaTarget: '/products',
      tone: 'light',
    },
    {
      id: 'pb2',
      kind: 'top',
      title: 'Top selling this week',
      subtitle: 'Pain relief & cold-flu essentials in stock.',
      image:
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'See top picks',
      ctaTarget: '/products',
      tone: 'dark',
    },
    {
      id: 'pb3',
      kind: 'deal',
      title: 'Save 15% on health devices',
      subtitle: 'BP monitors, thermometers, and pulse oximeters.',
      image:
        'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Shop devices',
      ctaTarget: '/products',
      tone: 'dark',
    },
    {
      id: 'pb4',
      kind: 'offer',
      title: 'Refer a friend · get ৳100 off',
      subtitle: 'Both of you save on your next prescription order.',
      image:
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Refer now',
      ctaTarget: '/(tabs)/me',
      tone: 'dark',
    },
  ],
  restaurant: [
    {
      id: 'rb1',
      kind: 'offer',
      title: '20% off pizza tonight',
      subtitle: 'Wood-fired classics, ready in 25 minutes.',
      image:
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Order now',
      ctaTarget: '/products',
      tone: 'dark',
    },
    {
      id: 'rb2',
      kind: 'top',
      title: "Chef's special · Truffle pasta",
      subtitle: 'Limited run — fresh shaved black truffle.',
      image:
        'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'View dish',
      ctaTarget: '/products',
      tone: 'dark',
    },
    {
      id: 'rb3',
      kind: 'deal',
      title: 'Free dessert with any main',
      subtitle: 'Choose tiramisu or panna cotta — your pick.',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Order now',
      ctaTarget: '/products',
      tone: 'dark',
    },
    {
      id: 'rb4',
      kind: 'offer',
      title: 'First order? Take ৳150 off',
      subtitle: 'New diners only — auto-applied at checkout.',
      image:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=72',
      ctaLabel: 'Order now',
      ctaTarget: '/products',
      tone: 'dark',
    },
  ],
};

export function bannersFor(tenantId) {
  return bannersByTenant[tenantId] || bannersByTenant.pharma;
}
