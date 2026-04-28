# Screen Spec — Multi-Tenant Storefront

This document is the design source of truth for every screen in the app. Each section
covers a screen's purpose, structure, components used, key interactions, and edge
states. The app ships **two themes** driven by tenant: **Pharma** (Epharma) and
**Restaurant** (Sandra Food). Both use the same screen structure unless noted —
visual differences come from tokens (`tokens.json`) and the `cardVariant` flag.

## Navigation map

```
(tabs)                          → 5-tab bottom bar
├── index            Home       → ShopScreenPharma | ShopScreenRestaurant
├── search           Search     → live filter, quick-view on tap
├── saved            Wishlist   → grid of hearted items
├── cart             Cart       → line items, totals, checkout
└── me               Account    → profile, orders, dev tenant toggle

stack (above tabs)
├── product/[id]                Product detail (PDP)
├── category/[id]               Category listing
├── products                    All Products (FlatList, search, filter, sort)
├── checkout                    Address + payment + place order
├── orders                      Auth-gated order history
├── tenant-switch               Production tenant switcher (modal)
└── (auth)
    ├── welcome                 Sign-in landing
    ├── phone                   Phone-number entry
    └── otp                     4-digit OTP verification
```

A single global **Quick-View bottom sheet** is mounted at the root; it opens from
search, home rails, All Products, cart line, wishlist — anywhere a product card
exists. Tap = quick-view. Long-press = full PDP.

---

## 1. Home (Pharma) — `app/(tabs)/index.js` → `ShopScreenPharma`

**Purpose:** info-dense, search-first storefront for a pharmacy. Photos exist but
play a supporting role.

**Sections (top to bottom):**
1. **Top bar** — Eyebrow "PHARMACY" + tenant name in display font. Right side: search and cart icon buttons. Cart icon shows a sky-blue badge with item count.
2. **Search shortcut** — Pressable pill that links to the Search tab. Subtle border, search icon left.
3. **Top brands rail** — Horizontal `ScrollView` of `Chip` components. Each chip taps through to `/category/[id]`. Sourced from `categories` sorted by item count desc, top 8.
4. **Featured list** — `SectionHead` + a vertical column of pharma `ProductCard` rows (clinical variant). Tap → quick-view, long-press → PDP.
5. **On sale rail** — Horizontal `ScrollView` of `ProductCardCompact` (150pt wide) for products with `was`. Snap to 162pt. Each card shows image, name, "Add quick →" link.
6. **New arrivals list** — Same shape as Featured.
7. **Health note callout** — Dark ink callout block: eyebrow "HEALTH NOTE", large display text "Always read the label and follow your prescription."

**Interactions:**
- Tap product card → opens Quick-View sheet
- Long-press product card → navigates to PDP
- Pull to refresh (future): re-runs splash

**States:**
- Loading: BootstrapLoadingScreen until cache or fetch resolves.
- Empty productsCache: each section shows nothing; we never render a stub.
- Error: BootstrapErrorScreen full-screen with retry.

---

## 2. Home (Restaurant) — `app/(tabs)/index.js` → `ShopScreenRestaurant`

**Purpose:** photo-led, evocative menu. Customers should *feel* the food.

**Sections:**
1. **Top bar** — Eyebrow "ESTD · TODAY" + restaurant name in italic Playfair display. Cart icon with terracotta badge.
2. **Hero dish** — Full-bleed photo (16:17 aspect), dark overlay, white text overlay (eyebrow "CHEF'S PICK", hero name in Playfair display), and an "Order now" button that opens that dish's quick-view directly.
3. **Cuisine rails** — One per category (Pizza, Burgers, Pasta…). `SectionHead` + horizontal rail of `ProductCardCompact` 160pt wide.
4. **Popular tonight** — 2-column grid of larger `ProductCard` (warm variant).
5. **House callout** — Dark callout: eyebrow "HOUSE NOTE", title "Cooked fresh, brought warm.", "Today's menu" ghost button.

**Differences from pharma:**
- Bigger images (1.1 aspect ratio in cards).
- Display font is serif italic.
- Brand line in cards is hidden (`showProductBrand: false`).
- Rating line shows on cards (`showProductRating: true`).
- Stock chip hidden (`showStockChip: false`).

---

## 3. Search — `(tabs)/search.js`

**Sections:**
1. **Sticky top** — Category chip rail (horizontal scroll). First chip "All", then live categories. Tap toggles filter.
2. **Sticky middle** — Search bar pill (white surface, search icon left, autoFocus, clear-X button when typed). Border tints terracotta/sky when active.
3. **Sticky bottom** — When filtering: pill with active-category label + result count.

**Body when query empty:**
- "RECENT" header + 3 recent search rows with chevron-right
- "TRENDING" header + chip row of 5 trending tags
- "Featured right now" — 2-col grid of first 4 products

**Body when query present:**
- 2-col grid of matching products (cap 60 visible)
- Empty: "Nothing just yet" / "Try a broader term…"

**Interactions:**
- Debounced 200ms substring match on `_search` (lowercased product name)
- Tap card → Quick-View sheet
- Long-press → PDP

---

## 4. All Products — `app/products.js`

**Purpose:** browse the entire catalog. New page (didn't exist in original Fragouras).

**Sections:**
1. **Header** — back button + "All products" title.
2. **Search row** — pill input (full width minus filter button) + filter icon button.
3. **Category chip rail** — horizontal scroll. "All" first, then every category.
4. **Sort chip rail** — horizontal scroll: Featured / Price ↑ / Price ↓ / A–Z.
5. **Count line** — "N products" small mono text.
6. **Grid** — `FlatList numColumns={2}` virtualized for 1500-item lists. Item = `ProductCard`.

**Empty state:** "No products match your search."

**Performance:** initialNumToRender: 10, maxToRenderPerBatch: 10, windowSize: 11, removeClippedSubviews. Tested with 1500-item Epharma response.

---

## 5. Category — `app/category/[id].js`

**Sections:**
- `MobileHeader` with title = category name + back + filter icon (placeholder).
- Horizontal sort chip rail (Featured, Price ↑, Price ↓, A–Z).
- Count line.
- 2-col grid of `ProductCard`.

**Behavior:** reads from `productsCache.byCategoryId[id]`. Tap → quick-view. Long-press → PDP.

---

## 6. Product Detail (PDP) — `app/product/[id].js`

**Sections:**
1. **Gallery** — full-width photo at 0.85 aspect. Floating circular FABs: back (top-left), heart (top-right). Fallback SVG placeholder when `feature_image` null.
2. **Info block** — brand eyebrow (if showProductBrand), product name (display font), rating line (if showProductRating), price + sale badge.
3. **About block** — bordered card. Eyebrow "ABOUT", description text, perk row with 3 icons (truck/shield/spark + label).
4. **Unit selector** *(pharma only)* — chip row of saleable measurements (`is_sales=1`). Each chip shows unit name and quantity (e.g. "Pata ×10"). Hidden if only 1 saleable unit.
5. **Related rail** — horizontal `ScrollView` of `ProductCardCompact` from same category. Tap → Quick-View.
6. **Sticky buy bar** (bottom, above tab bar): "Add to bag" ghost + "Buy now · price" primary.

**Combos** — was here as cross-sell rail. Currently commented (`COMBOS-DISABLED-V1`). Designer can leave space or remove from artboards.

**Quick-view from PDP** — suppressed (no-op). Don't open quick-view of the product you're already viewing.

---

## 7. Quick-View Sheet (global) — `src/components/QuickViewSheet`

**Anatomy:**
- Bottom sheet, 85% snap, swipe-down to dismiss
- Image (1.1 aspect, large)
- Brand eyebrow (mono uppercase, if available)
- Product name (display font, 2 lines max)
- Unit text under name
- Price row: current + strikethrough was
- Quantity row (top + bottom hairlines): "Quantity" label, − / N / + controls
- Two buttons: "Add to cart · price" (primary, ink bg) + "View" (ghost ring)

**Behavior:**
- Quantity defaults to 1 each open
- Adding closes the sheet
- "View" closes the sheet then router.push to PDP
- Dismissing via swipe or backdrop also resets state

---

## 8. Cart — `(tabs)/cart.js`

**Empty state:** large "Your bag is empty" + sub + "Start shopping" button.

**Filled:**
- Item count line ("3 items")
- List of cart rows. Each row:
  - Square image (left)
  - Brand eyebrow (if available) + name + variant (unit) + qty stepper + line total
  - Floating × top-right to remove
  - Tap row → opens Quick-View for that item (lets user adjust qty without leaving cart)
- Totals card (surfaceAlt bg): Subtotal / Shipping ("Calculated at checkout") / divider / Total
- Sticky bottom: "Checkout · total" primary button

---

## 9. Checkout — `app/checkout.js`

**Two steps** (was 3 before — combined shipping into payment):
1. **Address** — name, mobile (phone-pad), address line, city, postal (number-pad). Validation on Continue.
2. **Payment** — three large pressable cards: Cash on delivery / bKash / Nagad. Demo banner: "Demo checkout — no real charge will occur."

**Order summary** at the bottom (always visible): "ORDER · N ITEMS" eyebrow, first 3 lines, "+N more" if longer, divider, total.

**Place order:**
- Shows toast "Order placed · O_XXXX"
- Persists via `recordOrder()` to AsyncStorage
- Clears cart
- Navigates to `/orders` after 600ms

**Stepper:** two horizontal bars at top, dark when reached.

---

## 10. Orders — `app/orders.js`

**Auth-gated.** If `auth === null`:
- "Sign in to see orders" display heading
- Sub: "Your past purchases and active deliveries will live here."
- "Sign in" primary button → `(auth)/welcome`

**When signed in:**
- Tab chip row: All / Placed / Delivered
- Order cards (each):
  - Top: order id (uppercase mono) + date / status badge right
  - Thumb row: up to 4 product images + "N items" caption
  - Bottom row (top hairline): total price / "Track →" link

**Empty state per tab:** "No <tab> orders yet."

---

## 11. Wishlist — `(tabs)/saved.js`

**Empty:** large heart icon + "Nothing saved yet" + sub.
**Filled:** "N saved" count + 2-col grid of `ProductCard`.
- Tap → Quick-View
- Long-press → PDP

---

## 12. Account — `(tabs)/me.js`

**Sections:**
1. **Profile card** — dark ink card if signed in (avatar with first letter, name, tenant name). Pale "Welcome" card with right-side "Sign in" button if not.
2. **Stats row** — 3 cards: Orders count, Wishlist count, Spent total.
3. **Menu card** — Orders, Wishlist, Cart (with count), Help (disabled), "Sign in to a different store".
4. **Dev tenant toggle** *(only when `__DEV__`)* — radio rows: Pharmacy / Restaurant. Tap switches the entire app theme + data via `BootstrapProvider.switchTenant`.
5. **Sign out** link (red, when signed in).
6. Version label.

---

## 13. Auth Flow — `app/(auth)/`

### welcome
- Mono eyebrow with tenant name
- Large display title: "Sign in to\ncontinue shopping."
- Body explaining phone usage
- "Continue with phone" ink button + "Maybe later" ghost back

### phone
- Mobile number input (large, single line, phone-pad keyboard)
- "Send code" ink button at bottom
- Error inline beneath input

### otp
- 4-digit code input (huge font, wide letter-spacing for spacing effect)
- Optional name field underneath
- "Verify and continue" button — disabled until 4 digits entered
- Note: "In this preview, any 4 digits work."

---

## 14. Tenant Switch — `app/tenant-switch.js`

Production-only screen reachable from Account → "Sign in to a different store".

**Form:** License key (mono caps eyebrow) + Activation key. "Connect" button at bottom. Error shown inline. On success: replaces stack to `(tabs)`, shows toast "Switched store".

---

## 15. Bootstrap Loading — `src/bootstrap/BootstrapLoadingScreen`

Centered spinner + "Loading store…" small mono caption. Used while splash payload resolves.

## 16. Bootstrap Error — `src/bootstrap/BootstrapErrorScreen`

Centered. Display "Unable to load" + message keyed off error.kind:
- timeout → "The store is taking too long to respond."
- network → "No internet connection."
- other → "Something went wrong loading the store."
- "Try again" ink button.

---

## Tab bar — persistent at bottom of `(tabs)`

5 icons (24pt): Shop / Search / Saved / Cart / Me. Cart shows terracotta/primary badge with item count when > 0. Active tab uses ink color, inactive uses ink3.

---

## Theming summary

| Aspect | Pharma | Restaurant |
|---|---|---|
| Bg | `#F8FAFC` | `#FBF7F0` |
| Primary CTA | Sky `#0EA5E9` | Tomato `#B73E1F` |
| Display font | Inter Bold | Playfair Display |
| Body font | Inter | Inter |
| Eyebrow font | JetBrains Mono | JetBrains Mono |
| ProductCard | clinical (list-row) | warm (photo-led) |
| Card image ratio | 1:1 | 1.1:1 |
| Show brand | Yes | No |
| Show rating | No | Yes |
| Show stock chip | Yes | No |

**Switching themes is automatic** via `business_model_id` from the splash response.
The dev toggle in `/me` lets you preview both during design work.

---

## Dimensions to design at

- iPhone 13/14 (390 × 844pt) — primary canvas
- iPhone SE (375 × 667pt) — small breakpoint, copy must fit
- iPhone 14 Pro Max (430 × 932pt) — wide breakpoint, cards stretch
- For tablet/web responsiveness: design phone-first. Web uses the same layout
  centered in a 480px max-width container.
