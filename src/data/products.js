export const fragProducts = [
  // apparel
  { id: 'p1', name: 'Linen Overshirt', brand: 'Atelier Noir', cat: 'apparel', tags: ['linen','summer','unisex'], price: 168, was: 220, rating: 4.8, reviews: 214, palette: ['#E8DFD1','#C9B99B'], variants: { size:['XS','S','M','L','XL'], color:['Oat','Clay','Ink'] } },
  { id: 'p2', name: 'Wide-Leg Trouser', brand: 'Atelier Noir', cat: 'apparel', tags: ['tailored','spring'], price: 148, rating: 4.7, reviews: 182, palette: ['#D9CFBE','#8A7F6E'], variants: { size:['XS','S','M','L'], color:['Sand','Olive','Black'] } },
  { id: 'p3', name: 'Cropped Cardigan', brand: 'House of Kin', cat: 'apparel', tags: ['knit','cozy'], price: 124, rating: 4.6, reviews: 96, palette: ['#EFE3CE','#B59877'], variants: { size:['S','M','L'], color:['Cream','Moss','Rust'] } },
  { id: 'p4', name: 'Silk Slip Dress', brand: 'Luna & Co', cat: 'apparel', tags: ['silk','occasion'], price: 245, was: 320, rating: 4.9, reviews: 340, palette: ['#DCD0C0','#7F8A6A'], variants: { size:['XS','S','M','L'], color:['Sage','Bone','Rose'] } },
  { id: 'p5', name: 'Leather Slide', brand: 'Porto', cat: 'apparel', tags: ['shoes','leather'], price: 195, rating: 4.5, reviews: 78, palette: ['#E5D8C2','#6F5D47'], variants: { size:['36','37','38','39','40','41'], color:['Tan','Black'] } },
  { id: 'p6', name: 'Canvas Tote', brand: 'House of Kin', cat: 'apparel', tags: ['bag','everyday'], price: 68, rating: 4.7, reviews: 512, palette: ['#E8DFD1','#2B2A28'], variants: { color:['Natural','Ink','Terra'] } },

  // home
  { id: 'p7', name: 'Ceramic Vase, Tall', brand: 'Hjem', cat: 'home', tags: ['ceramic','decor'], price: 86, rating: 4.8, reviews: 44, palette: ['#F0E6D4','#B69C74'] },
  { id: 'p8', name: 'Linen Throw, Heavy', brand: 'Hjem', cat: 'home', tags: ['linen','bedding'], price: 142, rating: 4.9, reviews: 128, palette: ['#E8DFD1','#9C9176'] },
  { id: 'p9', name: 'Stoneware Mug, Set of 4', brand: 'Terre', cat: 'home', tags: ['ceramic','kitchen'], price: 72, was: 92, rating: 4.7, reviews: 221, palette: ['#D9CFBE','#5C584F'] },
  { id: 'p10', name: 'Taper Candles, Dozen', brand: 'Terre', cat: 'home', tags: ['decor','dinner'], price: 38, rating: 4.6, reviews: 88, palette: ['#F2E9D7','#C9B99B'] },

  // beauty
  { id: 'p11', name: 'Rosewood Face Serum', brand: 'Maison Vert', cat: 'beauty', tags: ['skin','serum'], price: 62, rating: 4.8, reviews: 603, palette: ['#EFD9CF','#B95B3C'] },
  { id: 'p12', name: 'Botanical Hand Wash', brand: 'Maison Vert', cat: 'beauty', tags: ['bath','botanical'], price: 28, rating: 4.7, reviews: 412, palette: ['#E8E3D0','#7F8A6A'] },
  { id: 'p13', name: 'Night Balm', brand: 'Maison Vert', cat: 'beauty', tags: ['skin','night'], price: 44, rating: 4.9, reviews: 258, palette: ['#F1E5D1','#9F7A52'] },

  // objects
  { id: 'p14', name: 'Brass Desk Clock', brand: 'Forma', cat: 'objects', tags: ['desk','brass'], price: 118, rating: 4.7, reviews: 39, palette: ['#EBDFC6','#A8894A'] },
  { id: 'p15', name: 'Notebook, A5 Linen', brand: 'Forma', cat: 'objects', tags: ['stationery'], price: 22, rating: 4.8, reviews: 318, palette: ['#E8DFD1','#2B2A28'] },
  { id: 'p16', name: 'Ink Pen, Matte', brand: 'Forma', cat: 'objects', tags: ['stationery'], price: 34, rating: 4.6, reviews: 142, palette: ['#DED2BE','#4A463E'] },
];

export const fragProductMap = Object.fromEntries(fragProducts.map(p => [p.id, p]));
