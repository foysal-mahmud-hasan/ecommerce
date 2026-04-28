# Component Anatomy

Every component the designer needs to build as a Figma component (with variants).
Numbers in pt. Padding/margin notes are exact pixel values from code so the Figma
output matches the running app.

## ProductCard

Two visual variants driven by tenant tokens.

### Variant: `clinical` (Pharma)
Horizontal list-row.

```
┌──────────────────────────────────────────────────────┐
│ ┌──────┐                                          ♡ │
│ │  76  │   BRAND (mono uppercase, 9pt, ink3)        │
│ │  ×76 │   Product name (Inter Medium, 14pt, 2 ln)  │
│ │ thumb│   ৳120        ● In stock (mono, success)   │
│ └──────┘                                              │
└──────────────────────────────────────────────────────┘
```

Outer: `surface` bg, 1pt `line` border, 12pt radius, 10pt padding, row layout, gap 10pt.
Heart icon: 16pt, top-right of row, plain (no glass bg).
Stock chip: small mono uppercase 10pt, `success` color when in stock else `sale` "Out".

### Variant: `warm` / `editorial` (Restaurant)
Vertical photo-led card (matches original Fragouras card).

```
┌──────────────────┐
│                  │
│   product image  │  ← 1.1:1 aspect for warm, 1:1 for editorial
│        ♡         │
│                  │
└──────────────────┘
  brand (eyebrow)        ← hidden in warm variant (showProductBrand: false)
  Product name
  $120  ★ 4.8 (215)      ← rating shown when showProductRating: true
```

Heart: floating circle, top-right, 34×34, `glass` bg, sm shadow.
Sale badge: top-left absolute, terra/sale color, "-N%" text.

### Props
- `product` — required. Shape: `{ id, name, brand, price, was, image, rating, reviews, palette? }`
- `onPress` — tap action (commonly opens Quick-View)
- `onLongPress` — long-press action (commonly navigates to PDP)
- `showWishlist` — bool, default true

---

## ProductCardCompact

Used in horizontal rails. Same structure as ProductCard editorial but no heart, no brand line, smaller fonts.

```
┌──────────────┐
│              │
│   image 1:1  │
│              │
└──────────────┘
  Product name (2 lines)
  $120
```

Width prop: 140 / 150 / 160 / 170pt depending on rail. Image is square. Image radius 8pt.

---

## QuickViewSheet (global bottom sheet)

```
                    ▬▬                  ← drag handle
─────────────────────────────────────
│                                    │
│         product image              │   ← 1.1:1 aspect, 18pt radius
│                                    │
─────────────────────────────────────
  BRAND (eyebrow mono, ink3)
  Product name (display, 20pt)
  Unit (sans, 12pt, ink3)
  ৳120  ৳150 ̶                       ← price + strikethrough was
  ───────────────────────────────
  Quantity              −  1  +
  ───────────────────────────────
  ┌─────────────────────────┐ ┌────┐
  │ Add to cart · ৳120      │ │View│
  └─────────────────────────┘ └────┘
```

Snap: 85% of screen height.
Background: `bg`.
Handle bar: `ink4` color.
Backdrop: 50% black.

### States
- Open from any product card tap (search, home rails, /products, cart row, wishlist)
- Suppressed from PDP (don't reopen the product you're viewing)
- Reset qty to 1 each open
- "Add to cart" closes sheet and shows global toast
- "View" closes sheet then navigates to PDP after 50ms

---

## FragButton

Variants:
- `primary` — terra bg, white text (CTA)
- `ink` — ink bg, bg-color text (high-contrast secondary)
- `ghost` — transparent + lineStrong border
- `quiet` — surfaceAlt bg
- `inkOnDark` — bg-color bg, ink text (used over dark hero)
- `ghostOnDark` — transparent + 35% white border, white text

Sizes: `sm` / `md` / `lg` (different padding + font size).
`full` prop = stretches to 100% width.
`disabled` = 0.4 opacity, no press.

---

## Chip (filter pill)

Inactive: transparent bg, `line` border, ink2 text.
Active: ink bg, bg-color text.
Padding 12 horizontal × 8 vertical, fully rounded (pill).

---

## Badge

Small label. Tones: `sale` (terra/red), `quiet` (surfaceAlt), `ink`, `cream`.
Used inline (rating row, on-card discount, order status).

---

## Rating

Star icon + value + (reviews) caption. Sizes 10/12/13.

---

## Heart

Outline / filled SVG. 16pt default, color = ink (not saved) or terra (saved).

---

## Swatch

Color circle, size ~26pt. Active state = ink ring + slightly larger.

---

## SectionHead

```
EYEBROW (mono uppercase, ink3)
Section title (display, 22pt, ink)                See all >
```

Title font is theme-driven (Playfair on restaurant, Inter Bold on pharma).
Optional `action` prop renders a chevron-right link on the right.

---

## Mobile Header

```
┌─◉─┐  Title (display, ink, centered or left)  ┌─◉─┐
└───┘                                           └───┘
back                                          right slot
```

`onBack` prop renders a circular surface back button (chevron-left). `right` prop is a custom node.
Padding accounts for safe-area top inset.

---

## Toast

Pill at the bottom (above tab bar). Dark ink bg, bg-color text. Fade in 200ms, hold 1.6s, fade out 200ms.

---

## Top bar (Home only)

Eyebrow line (mono uppercase, ink3) + tenant brand name (display, ink) on the left.
Right: search icon button + cart icon button. Cart icon shows a 16pt circular badge in `terra` (theme primary) with white text when count > 0.

Icon buttons: 38×38, surface bg, 1pt `line` border, fully circular.

---

## Hero (restaurant only)

Full-width image, 0.92 aspect ratio.
Dark overlay (32% black).
Bottom-left content:
- Eyebrow (mono uppercase)
- Hero title (display, white, 38pt)
- Optional italic continuation
- "Order now" `inkOnDark` button

---

## Buy Bar (PDP, sticky bottom)

Two buttons side-by-side:
- "Add to bag" — `ghost` size md, 1/3 width
- "Buy now · price" — `primary` size md, full remaining width

Top hairline (`line`), bg = page bg, padding 12 + safe-area bottom.

---

## Order Card

```
┌────────────────────────────────────────┐
│  O_LXY9Z                  [● Placed]   │  ← id mono / status badge
│  27 Apr 2026                            │
│  ┌──┐ ┌──┐ ┌──┐  3 items                │  ← thumb row
│  └──┘ └──┘ └──┘                         │
│  ────────────────────────────────────── │
│  ৳1,240            Track →              │  ← total / track link
└────────────────────────────────────────┘
```

surface bg, line border, md radius. Used in OrdersScreen.

---

## Stepper (checkout)

Two horizontal pills side-by-side. Active = ink bg. Inactive = line bg. 4pt height.
Below each: "01 · Address" / "02 · Payment" small mono label.
