# Screen reference pack

48 PNGs total — same 12 screens × 2 themes × 2 viewports.

## Naming convention

| Suffix | Viewport | Use |
|---|---|---|
| _(none) | 390×844, 2× DPR | iPhone 13 mobile (primary canvas) |
| `_web` | 1440×900, 1× DPR | Desktop browser |

## Mobile shots (24)
- `pharma_home.png`, `restaurant_home.png` — top bar, search shortcut, top brands / hero dish, featured list
- `pharma_search.png`, `restaurant_search.png` — empty state with category chips, recents, trending
- `pharma_products-all.png`, `restaurant_products-all.png` — All Products page, search + filter chips + grid
- `pharma_category.png`, `restaurant_category.png` — category filtered list
- `pharma_product.png`, `restaurant_product.png` — PDP with sticky buy bar
- `pharma_wishlist.png`, `restaurant_wishlist.png` — empty state
- `pharma_cart-empty.png`, `restaurant_cart-empty.png` — empty bag CTA
- `pharma_orders.png`, `restaurant_orders.png` — auth-gated sign-in prompt
- `pharma_account.png`, `restaurant_account.png` — welcome card (signed-out)
- `pharma_welcome.png`, `restaurant_welcome.png` — auth landing
- `pharma_phone.png`, `restaurant_phone.png` — phone-number entry
- `pharma_tenant-switch.png`, `restaurant_tenant-switch.png` — production store switcher

## Web shots (24)
Same 12 screens with `_web` suffix. The app now has **basic desktop-responsive
behavior** wired in code:

| Layout rule | Where |
|---|---|
| App container caps at 1280pt, centered | All screens, on web only |
| Phone-shaped layouts retained for most screens | Home, Search, Cart, Account, Auth, Checkout |
| 4-column grid on desktop / 3 on tablet / 2 on mobile | All Products |
| Side-by-side gallery + info | PDP |
| Sticky buy bar pinned to right column | PDP on desktop |

What the screenshots show:
- **Pharma home** — centered list-row cards at 1280pt, no awkward 700pt-wide cards.
- **Restaurant home** — hero photo and rails fit within the 1280pt container. The hero is still full-width within the container (intentional — it's the chef's pick) but the designer may want it smaller and side-by-side with text on a designed desktop variant.
- **All Products** — 4-column grid with even spacing. Browses 1500 products comfortably.
- **PDP** — large image on the left (55% width), all metadata + sticky buy bar on the right.
- **Auth, cart, account, orders** — phone-shaped centered column. These are intentionally narrow because their content is form-shaped or list-shaped; widening to 1280pt would just leave whitespace.

The breakpoints are defined in `src/utils/responsive.js`:
- mobile: < 768pt
- tablet: 768–1279pt
- desktop: ≥ 1280pt

Use `useBreakpoint()` from any screen to add more responsive variants — this is the
hook the designer's desktop redesigns can plug into.

## Known gaps
- **No quick-view sheet capture.** It's a global bottom sheet; needs a tap to open.
  Designer can preview live (run `npx expo start --web` → tap any product card).
- **No checkout / OTP screens.** They depend on cart state / nav params; would need
  a more involved capture script. Not critical — they're documented in SPEC.md.
- **No combos.** Combos are commented out (`COMBOS-DISABLED-V1` marker).
- **Loading / error / signed-in states** — only the empty/signed-out states were
  captured. Loading and error states are documented in SPEC.md §15–16.

## How to refresh

If the data or styles change and you need new screenshots:

```bash
cd /home/foysal/Desktop/Office/ecommerce-updated
# in another terminal:
npx expo start --port 19120 --offline
# wait ~25s for "Waiting on http://localhost:19120"
node scripts/capture-screens.js
```

The script lives at `scripts/capture-screens.js`. Edit ROUTES or DYNAMIC_ROUTES
arrays to add more captures. Output goes to `design-export/screens/`.
