// Deterministic 2-tone palette synthesized from a string (product name,
// category name, etc.). Used by RemoteImage's SVG fallback when feature_image
// is null — keeps the editorial placeholder consistent across renders.

const palettes = [
  ['#E8DFD1', '#C9B99B'],
  ['#E0D7C7', '#A89077'],
  ['#DDD3C1', '#85705B'],
  ['#E5DCC9', '#7C8769'],
  ['#D8E0D4', '#6E7B58'],
  ['#E0E5DE', '#8A9778'],
  ['#EFE4D2', '#B58F73'],
  ['#F1E5D1', '#A9572E'],
  ['#EBDDC3', '#9F7349'],
  ['#E1DDD3', '#5C5446'],
  ['#D5E0E2', '#4F7682'],
  ['#DCE3DA', '#5E7A5B'],
  ['#E8DCD0', '#B95B3C'],
  ['#E8E0D0', '#7D766C'],
  ['#DBE0D4', '#7F8A6A'],
];

function hashString(input) {
  if (!input) return 0;
  let h = 0;
  for (let i = 0; i < input.length; i += 1) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function paletteFor(input) {
  const idx = hashString(String(input || '')) % palettes.length;
  return palettes[idx];
}
