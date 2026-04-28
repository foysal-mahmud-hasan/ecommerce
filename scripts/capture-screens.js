#!/usr/bin/env node
/* eslint-disable no-console */
// Captures the storefront app at iPhone viewport for both tenants.
// Usage: node scripts/capture-screens.js

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE = process.env.APP_URL || 'http://localhost:19120';
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome';
const OUT = path.resolve(__dirname, '..', 'design-export', 'screens');

const VIEWPORTS = [
  { id: 'mobile', width: 390,  height: 844, deviceScaleFactor: 2 },
  { id: 'web',    width: 1440, height: 900, deviceScaleFactor: 1 },
];

const ROUTES = [
  { id: 'home',           path: '/',                          wait: 3000 },
  { id: 'search',         path: '/search',                    wait: 1500 },
  { id: 'wishlist',       path: '/saved',                     wait: 1500 },
  { id: 'cart-empty',     path: '/cart',                      wait: 1500 },
  { id: 'account',        path: '/me',                        wait: 1500 },
  { id: 'products-all',   path: '/products',                  wait: 3000 },
  { id: 'orders',         path: '/orders',                    wait: 1500 },
  { id: 'welcome',        path: '/welcome',                   wait: 1500 },
  { id: 'phone',          path: '/phone',                     wait: 1500 },
  { id: 'tenant-switch',  path: '/tenant-switch',             wait: 1500 },
];

// Routes that need real product/category IDs picked at runtime
const DYNAMIC_ROUTES = [
  { id: 'category',  build: (state) => `/category/${state.firstCategoryId}`, wait: 2500 },
  { id: 'product',   build: (state) => `/product/${state.firstProductId}`,  wait: 2500 },
];

const TENANTS = ['pharma', 'restaurant'];

const fs_ = fs.promises;

async function ensureDir(p) {
  await fs_.mkdir(p, { recursive: true });
}

async function seedTenant(page, tenantId) {
  // Pre-seed AsyncStorage (which on web is localStorage) so the BootstrapProvider
  // picks the right tenant on next navigation. The keys come from src/api/storage.js.
  await page.evaluate((id) => {
    try {
      window.localStorage.setItem('frag:v1:tenant', JSON.stringify({ id }));
    } catch {}
  }, tenantId);
}

async function readState(page) {
  // Pull a couple of fields out of the running app's productsCache + categories
  // so we can deep-link product/category screens with real IDs.
  return page.evaluate(() => {
    // The app exposes nothing on window by default; we walk localStorage.
    function findFirst(obj) {
      try {
        const tenant = JSON.parse(localStorage.getItem('frag:v1:tenant'));
        if (!tenant?.id) return null;
        const splashRaw = localStorage.getItem(`frag:v1:${tenant.id}:splash`);
        if (!splashRaw) return null;
        const splash = JSON.parse(splashRaw);
        const product = splash?.payload?.productsCache?.all?.[0];
        const category = splash?.payload?.categories?.[0];
        return {
          firstProductId: product?.id || null,
          firstCategoryId: category?.id || null,
        };
      } catch (e) {
        return null;
      }
    }
    return findFirst();
  });
}

async function shoot(page, route, file) {
  const url = `${BASE}${route.path}`;
  console.log('   → ' + route.id + '  (' + route.path + ')');
  await page.goto(url, { waitUntil: 'load', timeout: 60000 }).catch((e) => {
    console.log('     load timeout — proceeding to wait+shoot anyway');
  });
  await new Promise((r) => setTimeout(r, route.wait));
  await page.screenshot({ path: file, fullPage: false });
}

async function main() {
  await ensureDir(OUT);
  console.log('Launching Chrome via ' + CHROME);
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    for (const vp of VIEWPORTS) {
      for (const tenant of TENANTS) {
        console.log('\n=== ' + tenant.toUpperCase() + ' · ' + vp.id + ' (' + vp.width + 'x' + vp.height + ') ===');
        const page = await browser.newPage();
        await page.setViewport(vp);
        page.on('pageerror', (e) => console.log('   pageerror:', e.message));

        // First load any URL so localStorage is reachable, then seed tenant.
        await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 }).catch(() => {});
        await seedTenant(page, tenant);
        // Reload so BootstrapProvider picks the new tenant.
        await page.reload({ waitUntil: 'load', timeout: 60000 }).catch(() => {});
        console.log('   waiting for bootstrap…');
        await new Promise((r) => setTimeout(r, 12000));

        const state = (await readState(page)) || {};
        console.log('   product=' + state.firstProductId + '  category=' + state.firstCategoryId);

        const suffix = vp.id === 'mobile' ? '' : '_' + vp.id;

        // Static routes
        for (const r of ROUTES) {
          const file = path.join(OUT, `${tenant}_${r.id}${suffix}.png`);
          try {
            await shoot(page, r, file);
          } catch (e) {
            console.log('     SKIPPED ' + r.id + ': ' + e.message);
          }
        }

        // Dynamic routes
        for (const r of DYNAMIC_ROUTES) {
          const built = r.build(state);
          if (!built.includes('null') && !built.includes('undefined')) {
            const file = path.join(OUT, `${tenant}_${r.id}${suffix}.png`);
            try {
              await shoot(page, { ...r, path: built }, file);
            } catch (e) {
              console.log('     SKIPPED ' + r.id + ': ' + e.message);
            }
          } else {
            console.log('     SKIPPED ' + r.id + ' (no live data yet)');
          }
        }

        await page.close();
      }
    }
  } finally {
    await browser.close();
  }
  console.log('\nDone. Screenshots in: ' + OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
