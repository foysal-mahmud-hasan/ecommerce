import { fragProductMap } from './products';

export const fragCombos = [
  {
    id: 'c1',
    name: 'The Sunday Linen',
    tagline: 'An unhurried morning, in three pieces.',
    kind: 'outfit',
    items: ['p1','p2','p5'],
    price: 468,
    occasion: 'Everyday',
    season: 'Summer',
  },
  {
    id: 'c2',
    name: 'Quiet Evening',
    tagline: 'Silk, sage, soft leather.',
    kind: 'outfit',
    items: ['p4','p5','p6'],
    price: 478,
    occasion: 'Date night',
    season: 'All season',
  },
  {
    id: 'c3',
    name: 'The Bath Ritual',
    tagline: 'A complete evening shelf.',
    kind: 'beauty',
    items: ['p11','p12','p13'],
    price: 118,
    occasion: 'Self-care',
    season: 'All season',
  },
  {
    id: 'c4',
    name: 'Table for Four',
    tagline: 'Mugs, tapers, a heavy throw.',
    kind: 'home',
    items: ['p9','p10','p8'],
    price: 228,
    occasion: 'Hosting',
    season: 'Autumn',
  },
  {
    id: 'c5',
    name: 'Desk in Repose',
    tagline: 'Brass, linen, black ink.',
    kind: 'desk',
    items: ['p14','p15','p16'],
    price: 158,
    occasion: 'Work from home',
    season: 'All season',
  },
];

export const fragComboMap = Object.fromEntries(fragCombos.map(c => [c.id, c]));

export function fragComboSum(combo) {
  return combo.items.reduce((s, id) => s + fragProductMap[id].price, 0);
}

export function fragComboSavings(combo) {
  const sum = fragComboSum(combo);
  const save = sum - combo.price;
  return { sum, save, pct: Math.round((1 - combo.price / sum) * 100) };
}
