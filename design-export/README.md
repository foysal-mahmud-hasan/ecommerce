# Design Handoff — Multi-Tenant Storefront

This folder is the design source of truth for the Expo React Native app at
`/home/foysal/Desktop/Office/ecommerce-updated`. Hand it to the designer; they have
everything they need to build out the Figma file.

## What's in here

| File | Purpose |
|---|---|
| `tokens.json` | Design tokens (colors, type, spacing, radius, shadows) for both Pharma and Restaurant themes. Drop into the **Tokens Studio for Figma** plugin. |
| `SPEC.md` | Screen-by-screen brief — every screen's structure, components, interactions, and edge states. |
| `COMPONENTS.md` | Component anatomy with prop variants, dimensions, and visual specs. |
| `screens/` | 24 PNG screenshots at iPhone viewport — both themes, all primary screens. See `screens/README.md`. |
| `README.md` | This file. |

## How the designer uses this (15-minute setup)

### 1. Install Tokens Studio for Figma
Open Figma, go to the file, then **Plugins → Browse all plugins → Tokens Studio for Figma**. It's free.

### 2. Import tokens.json
Run the plugin → "Tools" → "Load from file/folder/preset" → choose **JSON**. Paste the contents of `tokens.json` into the editor (or use the "Import" button if available).

You should now see three token sets in the left panel:
- **global** — primitives (spacing scale, radius, type sizes, shadows). Always enabled.
- **pharma** — pharma colors, typography, card variant. Enable for pharma theme work.
- **restaurant** — restaurant colors, typography, card variant. Enable for restaurant work.

The plugin's **$themes** at the top lets her switch between themes with one click — useful while drafting screens to confirm both look right.

### 3. Push tokens as Figma variables
Top-right of the plugin panel: **"Push to Figma styles & variables"**. Tick "Variables", click. The plugin creates Figma variables that any layer can bind to. Now changing a token in code → updating the JSON → re-pushing keeps the design file in sync.

### 4. Read SPEC.md and COMPONENTS.md side-by-side while designing
- `SPEC.md` lists every screen, its sections, its states. Use this to know **what** to design.
- `COMPONENTS.md` describes each component's anatomy. Use this to build the **component library** before laying out screens.

### 5. Use the running app as visual reference
The implementation is alive at `/home/foysal/Desktop/Office/ecommerce-updated`. Run:
```bash
cd /home/foysal/Desktop/Office/ecommerce-updated
npx expo start --web
```
Press `w` to open in browser. Live, both themes accessible via the **dev tenant toggle** in the Account tab.

### 6. Recommended Figma file structure

```
📄 [App name] — Storefront

📁 0 · Foundations
  ◇ Colors (auto from variables)
  ◇ Typography (text styles)
  ◇ Spacing & radius
  ◇ Shadows

📁 1 · Components (per COMPONENTS.md)
  ◇ ProductCard (variants: clinical, warm, editorial)
  ◇ ProductCardCompact
  ◇ QuickViewSheet
  ◇ FragButton (variants: primary/ink/ghost/quiet/inkOnDark/ghostOnDark × sm/md/lg)
  ◇ Chip
  ◇ Badge (variants: sale/quiet/ink/cream)
  ◇ Rating, Heart, Swatch, SectionHead, MobileHeader, Toast
  ◇ Order Card
  ◇ Stepper

📁 2 · Pharma flows
  ◇ Home
  ◇ Search
  ◇ All products
  ◇ Category
  ◇ PDP
  ◇ Quick-View
  ◇ Cart
  ◇ Checkout
  ◇ Orders
  ◇ Account
  ◇ Auth (welcome / phone / OTP)
  ◇ Tenant switch
  ◇ Bootstrap (loading / error)

📁 3 · Restaurant flows
  ◇ Home
  ◇ … (same screens, different tokens)

📁 4 · States & edge cases
  ◇ Empty cart, wishlist, search, orders
  ◇ Auth-gated orders prompt
  ◇ Error / offline screens
```

### 7. When changes happen on either side

**Designer changes a token in Figma** → push back through Tokens Studio → export as JSON → developer updates `src/theme/themes/<tenant>/*.js` accordingly.

**Developer changes a token in code** → regenerate `tokens.json` (this folder is the canonical export point) → designer re-imports.

Variables stay synced this way without copy-paste mistakes.

---

## Notes on what's intentionally not yet here

- **Screenshots:** see `screens/` — 24 PNGs at iPhone 13 viewport, both themes, captured from the live build with real data. The screens README lists known gaps.
- **Dark mode** is not designed. Theme files have `fragDark` exported but it's not wired to the UI — leave dark for v2 unless the spec changes.
- **Combos** (dark hero card cross-sell, swap bottom sheet) are commented out in code with marker `COMBOS-DISABLED-V1`. Design files should not include combos for v1, but worth keeping the marker in mind for revival later.
