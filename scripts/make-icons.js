// Generate placeholder icons (icon, adaptive-icon, splash) as solid-green
// PNGs with a centered white medical cross. Uses Node built-ins only —
// zlib for deflate, manual PNG chunk encoding. Run once via:
//   node scripts/make-icons.js
//
// Replace these assets with real branded artwork when available.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BRAND_R = 0x06;
const BRAND_G = 0xA0;
const BRAND_B = 0x5A;

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([length, typeBuf, data, crcBuf]);
}

function buildPng(width, height, drawPixel) {
  const rowBytes = 1 + width * 4;
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const offset = y * rowBytes;
    raw[offset] = 0;
    for (let x = 0; x < width; x++) {
      const p = offset + 1 + x * 4;
      const [r, g, b, a] = drawPixel(x, y);
      raw[p] = r;
      raw[p + 1] = g;
      raw[p + 2] = b;
      raw[p + 3] = a;
    }
  }
  const compressed = zlib.deflateSync(raw);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function pixelGreenWithCross(size) {
  const cx = size / 2;
  const cy = size / 2;
  const armThickness = size * 0.18;
  const armLength = size * 0.5;
  return (x, y) => {
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const inHoriz = dy <= armThickness / 2 && dx <= armLength / 2;
    const inVert = dx <= armThickness / 2 && dy <= armLength / 2;
    if (inHoriz || inVert) return [255, 255, 255, 255];
    return [BRAND_R, BRAND_G, BRAND_B, 255];
  };
}

function pixelSolidGreen() {
  return () => [BRAND_R, BRAND_G, BRAND_B, 255];
}

const assets = path.join(__dirname, '..', 'assets');
const size = 1024;

fs.writeFileSync(path.join(assets, 'icon.png'), buildPng(size, size, pixelGreenWithCross(size)));
fs.writeFileSync(
  path.join(assets, 'adaptive-icon.png'),
  // adaptive icons get cropped to a circle/squircle; keep the cross well
  // inside the safe zone (~66% of canvas centered).
  buildPng(size, size, pixelGreenWithCross(size)),
);
fs.writeFileSync(path.join(assets, 'splash-icon.png'), buildPng(size, size, pixelGreenWithCross(size)));

// Favicon for web — 48x48 still readable as cross
fs.writeFileSync(path.join(assets, 'favicon.png'), buildPng(48, 48, pixelGreenWithCross(48)));

console.log('Generated icon.png, adaptive-icon.png, splash-icon.png, favicon.png in', assets);
