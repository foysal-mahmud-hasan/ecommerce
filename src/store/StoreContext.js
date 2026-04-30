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
  const [productsCache, setProductsCache] = useState(emptyProductsCache);
  const [bootstrapStatus, setBootstrapStatus] = useState('idle');

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

  const setSplashData = useCallback(({ tenant: t, categories: cats, productsCache: pc }) => {
    if (cats) setCategories(cats);
    if (pc) setProductsCache(pc);
    if (t) setTenantState(t);
  }, []);

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
      productsCache,
      bootstrapStatus,
      setBootstrapStatus,
      setTenant,
      setSplashData,
      // auth
      auth,
      signIn,
      signOut,
      // orders
      orders,
      recordOrder,
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
      productsCache,
      bootstrapStatus,
      setTenant,
      setSplashData,
      auth,
      signIn,
      signOut,
      orders,
      recordOrder,
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
