import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TenantContext } from './TenantContext';
import { storageKeys, getJSON, setJSON, clearTenant as clearTenantStorage } from '../api/storage';
import { FALLBACK_TENANT } from '../config/tenants';
import {
  getCategoryProducts,
  getTagProducts,
  getProductDetail,
} from '../api/products';
import { fetchOrders as fetchOrdersApi } from '../api/orders';

const StoreContext = createContext(null);

const emptyProductsCache = { all: [], byId: {}, byCategoryId: {} };

export function StoreProvider({ children }) {
  // ── core ecommerce state (existing) ────────────────────────────────────
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [comboLayout, setComboLayout] = useState('flatlay');
  const [builder, setBuilder] = useState({});
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  // ── new: tenant + bootstrap ────────────────────────────────────────────
  const [tenant, setTenantState] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [productsCache, setProductsCache] = useState(emptyProductsCache);
  const [bootstrapStatus, setBootstrapStatus] = useState('idle');
  const [credentials, setCredentialsState] = useState(null);

  // Per-resource load status maps. Each is { [key]: 'idle'|'loading'|'ready'|'error' }
  // so screens can render spinners and we can skip refetches that already
  // succeeded. Updated by the load* thunks below.
  const [categoryStatus, setCategoryStatus] = useState({});
  const [tagStatus, setTagStatus] = useState({});
  const [detailStatus, setDetailStatus] = useState({});
  const [tagProducts, setTagProducts] = useState({}); // { [tagId]: [productId,…] }
  const [ordersStatus, setOrdersStatus] = useState('idle');

  // ── new: auth + orders (tenant-scoped) ─────────────────────────────────
  const [auth, setAuth] = useState(null);
  const [orders, setOrders] = useState([]);

  // ── new: SPA quick-view ────────────────────────────────────────────────
  const [quickViewProductId, setQuickViewProductId] = useState(null);

  // ── new: cart sheet (multi-step inline checkout) ───────────────────────
  const [cartSheetOpen, setCartSheetOpen] = useState(false);
  const [cartSheetStep, setCartSheetStep] = useState(0); // 0 review · 1 addr · 2 pay · 3 done

  // ── new: prescription upload sheet ─────────────────────────────────────
  const [prescriptionSheetOpen, setPrescriptionSheetOpen] = useState(false);

  const tenantId = tenant?.id || null;
  const currency = tenant?.currency || { code: 'USD', symbol: '$', position: 'before', decimals: 0 };

  // ── persistence: hydrate cart/wishlist/auth/orders when tenant changes ──
  const hydratedTenantRef = useRef(null);
  useEffect(() => {
    if (!tenantId) return;
    if (hydratedTenantRef.current === tenantId) return;
    hydratedTenantRef.current = tenantId;
    let alive = true;
    (async () => {
      const [c, w, a, o] = await Promise.all([
        getJSON(storageKeys.cart(tenantId)),
        getJSON(storageKeys.wishlist(tenantId)),
        getJSON(storageKeys.auth(tenantId)),
        getJSON(storageKeys.orders(tenantId)),
      ]);
      if (!alive) return;
      setCart(Array.isArray(c) ? c : []);
      setWishlist(Array.isArray(w) ? w : []);
      setAuth(a || null);
      setOrders(Array.isArray(o) ? o : []);
    })();
    return () => {
      alive = false;
    };
  }, [tenantId]);

  // ── persistence: save-on-change (debounced via microtask batching) ─────
  useEffect(() => {
    if (!tenantId || hydratedTenantRef.current !== tenantId) return;
    setJSON(storageKeys.cart(tenantId), cart);
  }, [cart, tenantId]);
  useEffect(() => {
    if (!tenantId || hydratedTenantRef.current !== tenantId) return;
    setJSON(storageKeys.wishlist(tenantId), wishlist);
  }, [wishlist, tenantId]);
  useEffect(() => {
    if (!tenantId || hydratedTenantRef.current !== tenantId) return;
    setJSON(storageKeys.auth(tenantId), auth);
  }, [auth, tenantId]);
  useEffect(() => {
    if (!tenantId || hydratedTenantRef.current !== tenantId) return;
    setJSON(storageKeys.orders(tenantId), orders);
  }, [orders, tenantId]);

  // ── toast ──────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  const variantKey = (v) => JSON.stringify(v || {});

  // ── cart actions (existing, unchanged signatures) ──────────────────────
  const addToCart = useCallback(
    (id, qty = 1, variant = {}) => {
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (i) => i.id === id && variantKey(i.variant) === variantKey(variant),
        );
        if (existingIdx >= 0) {
          const next = [...prev];
          next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + qty };
          return next;
        }
        return [...prev, { id, qty, variant }];
      });
      showToast('Added to cart');
    },
    [showToast],
  );

  const addMany = useCallback(
    (ids, variants = {}) => {
      setCart((prev) => {
        const next = [...prev];
        ids.forEach((id) => {
          const existingIdx = next.findIndex((i) => i.id === id);
          if (existingIdx >= 0) {
            next[existingIdx] = { ...next[existingIdx], qty: next[existingIdx].qty + 1 };
          } else {
            next.push({ id, qty: 1, variant: variants[id] || {} });
          }
        });
        return next;
      });
      showToast('Set added to cart');
    },
    [showToast],
  );

  const updateQty = useCallback((idx, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((_, i) => i !== idx);
      return prev.map((item, i) => (i === idx ? { ...item, qty } : item));
    });
  }, []);

  const removeFromCart = useCallback((idx) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        showToast('Saved to wishlist');
        return [...prev, id];
      });
    },
    [showToast],
  );

  const setBuilderItems = useCallback((comboId, items, swapped = true) => {
    setBuilder((prev) => ({ ...prev, [comboId]: { items, swapped } }));
  }, []);

  // ── tenant + splash actions ────────────────────────────────────────────
  const setTenant = useCallback(
    async (next, { wipeOldTenant = false } = {}) => {
      const oldId = tenant?.id;
      const newId = next?.id;
      if (wipeOldTenant && oldId && oldId !== newId) {
        await clearTenantStorage(oldId);
      }
      // If switching to a different tenant, force re-hydration on next render.
      if (oldId !== newId) {
        hydratedTenantRef.current = null;
        setCart([]);
        setWishlist([]);
        setAuth(null);
        setOrders([]);
      }
      setTenantState(next);
      if (newId) await setJSON(storageKeys.tenant, { id: newId });
    },
    [tenant?.id],
  );

  const setSplashData = useCallback(
    ({ tenant: t, categories: cats, productsCache: pc, tags: tgs }) => {
      if (cats) setCategories(cats);
      if (pc) setProductsCache(pc);
      if (tgs) setTags(tgs);
      if (t) setTenantState(t);
    },
    [],
  );

  const setCredentials = useCallback((c) => {
    setCredentialsState(c || null);
  }, []);

  // Immutably fold a list of normalized products into productsCache. De-dupes
  // by id so re-fetches of the same category/tag don't bloat the `all` array.
  const mergeProducts = useCallback((list) => {
    if (!Array.isArray(list) || list.length === 0) return;
    setProductsCache((prev) => {
      const byId = { ...prev.byId };
      const byCategoryId = { ...prev.byCategoryId };
      const all = prev.all.slice();
      for (const p of list) {
        if (!p || !p.id) continue;
        const existed = !!byId[p.id];
        byId[p.id] = p;
        if (!existed) all.push(p);
        else {
          const idx = all.findIndex((x) => x.id === p.id);
          if (idx >= 0) all[idx] = p;
        }
        const ck = String(p.categoryId);
        if (ck && ck !== 'undefined' && ck !== 'null') {
          const bucket = byCategoryId[ck] ? byCategoryId[ck].slice() : [];
          const idx = bucket.findIndex((x) => x.id === p.id);
          if (idx >= 0) bucket[idx] = p;
          else bucket.push(p);
          byCategoryId[ck] = bucket;
        }
      }
      return { all, byId, byCategoryId };
    });
  }, []);

  // ── thunks: fetch + merge ──────────────────────────────────────────────
  // Each thunk is idempotent (returns early if already loading/ready unless
  // force=true) and writes status into the matching status map.

  const loadCategoryProducts = useCallback(
    async (categoryId, { force = false } = {}) => {
      if (!credentials || categoryId == null) return null;
      const key = String(categoryId);
      const current = categoryStatus[key];
      if (!force && (current === 'loading' || current === 'ready')) return null;
      setCategoryStatus((s) => ({ ...s, [key]: 'loading' }));
      try {
        const { items } = await getCategoryProducts({ credentials, categoryId });
        mergeProducts(items);
        setCategoryStatus((s) => ({ ...s, [key]: 'ready' }));
        return items;
      } catch (err) {
        setCategoryStatus((s) => ({ ...s, [key]: 'error' }));
        return null;
      }
    },
    [credentials, categoryStatus, mergeProducts],
  );

  const loadTagProducts = useCallback(
    async (tagId, { force = false } = {}) => {
      if (!credentials || tagId == null) return null;
      const key = String(tagId);
      const current = tagStatus[key];
      if (!force && (current === 'loading' || current === 'ready')) return null;
      setTagStatus((s) => ({ ...s, [key]: 'loading' }));
      try {
        const { items } = await getTagProducts({ credentials, tagId });
        mergeProducts(items);
        setTagProducts((m) => ({ ...m, [key]: items.map((p) => p.id) }));
        setTagStatus((s) => ({ ...s, [key]: 'ready' }));
        return items;
      } catch (err) {
        setTagStatus((s) => ({ ...s, [key]: 'error' }));
        return null;
      }
    },
    [credentials, tagStatus, mergeProducts],
  );

  const loadProductDetail = useCallback(
    async (stockId, { force = false } = {}) => {
      if (!credentials || stockId == null) return null;
      const key = String(stockId);
      const current = detailStatus[key];
      if (!force && (current === 'loading' || current === 'ready')) return null;
      setDetailStatus((s) => ({ ...s, [key]: 'loading' }));
      try {
        const product = await getProductDetail({ credentials, stockId });
        if (product) mergeProducts([product]);
        setDetailStatus((s) => ({ ...s, [key]: product ? 'ready' : 'error' }));
        return product;
      } catch (err) {
        setDetailStatus((s) => ({ ...s, [key]: 'error' }));
        return null;
      }
    },
    [credentials, detailStatus, mergeProducts],
  );

  // ── auth actions ───────────────────────────────────────────────────────
  const signIn = useCallback((session) => {
    setAuth(session);
  }, []);

  const signOut = useCallback(() => {
    setAuth(null);
    setCart([]);
    setOrders([]);
  }, []);

  // ── orders ─────────────────────────────────────────────────────────────
  const recordOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  // Live order history. Replaces the local orders list with backend data
  // (which already includes any orders the user placed via the legacy local
  // checkout path; backend has no create-order endpoint yet).
  const loadOrders = useCallback(
    async ({ force = false } = {}) => {
      if (!credentials) return null;
      const userId = auth?.user?.id || auth?.userId;
      if (!userId) return null;
      if (!force && ordersStatus === 'loading') return null;
      setOrdersStatus('loading');
      try {
        const { orders: list } = await fetchOrdersApi({ credentials, userId });
        setOrders(list);
        setOrdersStatus('ready');
        return list;
      } catch (err) {
        setOrdersStatus('error');
        return null;
      }
    },
    [credentials, auth, ordersStatus],
  );

  // Look up by either order id or transactionId so the SSLCommerz callback
  // (which only knows the tran_id) can flip the status without the caller
  // needing to map between them.
  const setOrderStatus = useCallback((key, { status, transactionId } = {}) => {
    if (!key || !status) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === key || o.transactionId === key
          ? { ...o, status, transactionId: transactionId || o.transactionId }
          : o,
      ),
    );
  }, []);

  // ── quick-view ─────────────────────────────────────────────────────────
  const openQuickView = useCallback((id) => {
    if (!id) return;
    // Single-sheet policy: opening one closes the others.
    setCartSheetOpen(false);
    setPrescriptionSheetOpen(false);
    setQuickViewProductId(String(id));
  }, []);

  const closeQuickView = useCallback(() => setQuickViewProductId(null), []);

  // ── cart sheet ─────────────────────────────────────────────────────────
  const openCartSheet = useCallback(() => {
    setQuickViewProductId(null);
    setPrescriptionSheetOpen(false);
    setCartSheetStep(0);
    setCartSheetOpen(true);
  }, []);

  const closeCartSheet = useCallback(() => {
    setCartSheetOpen(false);
    // Reset step lazily so the close animation doesn't show a flash of step 0.
    setTimeout(() => setCartSheetStep(0), 250);
  }, []);

  // ── prescription sheet ─────────────────────────────────────────────────
  const openPrescriptionSheet = useCallback(() => {
    setQuickViewProductId(null);
    setCartSheetOpen(false);
    setPrescriptionSheetOpen(true);
  }, []);

  const closePrescriptionSheet = useCallback(() => {
    setPrescriptionSheetOpen(false);
  }, []);

  // ── tenant context value (memoized separately to avoid theme thrash) ──
  const tenantValue = useMemo(
    () => ({ tenantId: tenantId || FALLBACK_TENANT, tenant }),
    [tenantId, tenant],
  );

  const value = useMemo(
    () => ({
      // existing
      cart,
      wishlist,
      searchQuery,
      comboLayout,
      builder,
      toast,
      addToCart,
      addMany,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      setSearchQuery,
      setComboLayout,
      setBuilderItems,
      showToast,
      // new: tenant + data
      tenant,
      tenantId,
      currency,
      categories,
      tags,
      productsCache,
      bootstrapStatus,
      setBootstrapStatus,
      setTenant,
      setSplashData,
      credentials,
      setCredentials,
      // products thunks + status maps
      mergeProducts,
      categoryStatus,
      tagStatus,
      detailStatus,
      tagProducts,
      loadCategoryProducts,
      loadTagProducts,
      loadProductDetail,
      // auth
      auth,
      signIn,
      signOut,
      // orders
      orders,
      ordersStatus,
      loadOrders,
      recordOrder,
      setOrderStatus,
      // quick-view
      quickViewProductId,
      openQuickView,
      closeQuickView,
      // cart sheet
      cartSheetOpen,
      cartSheetStep,
      setCartSheetStep,
      openCartSheet,
      closeCartSheet,
      // prescription sheet
      prescriptionSheetOpen,
      openPrescriptionSheet,
      closePrescriptionSheet,
    }),
    [
      cart,
      wishlist,
      searchQuery,
      comboLayout,
      builder,
      toast,
      addToCart,
      addMany,
      updateQty,
      removeFromCart,
      clearCart,
      toggleWishlist,
      setBuilderItems,
      showToast,
      tenant,
      tenantId,
      currency,
      categories,
      tags,
      productsCache,
      bootstrapStatus,
      setTenant,
      setSplashData,
      credentials,
      setCredentials,
      mergeProducts,
      categoryStatus,
      tagStatus,
      detailStatus,
      tagProducts,
      loadCategoryProducts,
      loadTagProducts,
      loadProductDetail,
      auth,
      signIn,
      signOut,
      orders,
      ordersStatus,
      loadOrders,
      recordOrder,
      setOrderStatus,
      quickViewProductId,
      openQuickView,
      closeQuickView,
      cartSheetOpen,
      cartSheetStep,
      openCartSheet,
      closeCartSheet,
      prescriptionSheetOpen,
      openPrescriptionSheet,
      closePrescriptionSheet,
    ],
  );

  return (
    <TenantContext.Provider value={tenantValue}>
      <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    </TenantContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// fragCartTotal now takes a productMap so it works against live data.
export function fragCartTotal(cart, productMap) {
  if (!productMap) return 0;
  return cart.reduce((s, i) => {
    const p = productMap[i.id];
    if (!p) return s;
    return s + p.price * i.qty;
  }, 0);
}

export function fragCartCount(cart) {
  return cart.reduce((s, i) => s + i.qty, 0);
}
