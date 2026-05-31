import React, { useCallback, useEffect, useState } from 'react';
import { useStore } from '../store/StoreContext';
import {
  fetchSplash,
  loadCachedSplash,
  persistSplash,
} from '../api/splash';
import { getJSON, setJSON, storageKeys } from '../api/storage';
import {
  DEFAULT_CREDENTIALS,
  TENANT_PHARMA,
  TENANT_RESTAURANT,
  detectTenantId,
} from '../config/tenants';
import BootstrapErrorScreen from './BootstrapErrorScreen';
import BootstrapLoadingScreen from './BootstrapLoadingScreen';

// BootstrapProvider gates first paint behind a splash fetch. Strategy:
//   1. Read the last-used tenantId + credentials from AsyncStorage.
//   2. If a fresh cached splash exists, render the app immediately and
//      revalidate in the background.
//   3. If stale or missing, fetch first.
//   4. Errors render BootstrapErrorScreen with a retry button.
//
// Switching tenants is a re-run of step 2-3 with new credentials.

export default function BootstrapProvider({ children }) {
  const {
    setSplashData,
    setBootstrapStatus,
    setTenant,
    setCredentials: setStoreCredentials,
    loadTagProducts,
  } = useStore();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [, setForcedTenantId] = useState(null);

  // After splash succeeds, warm the tag groups so the home screen has product
  // rails ready immediately. Tags are the primary product-loading mechanism
  // for the live backend (per plan).
  const warmTags = useCallback(
    (payload) => {
      const list = payload?.tags || [];
      list.forEach((t) => {
        if (t?.id) loadTagProducts(t.id).catch(() => {});
      });
    },
    [loadTagProducts],
  );

  const run = useCallback(async (creds, opts = {}) => {
    setStatus('loading');
    setError(null);
    setBootstrapStatus('loading');
    try {
      // Tenant identity is decided by the splash backend response
      // (domain_config.business_model_id), NOT by a stored hint. A leftover
      // {id:'restaurant'} in AsyncStorage used to short-circuit us into the
      // mock and never call the live backend — that trap is gone.
      //
      // The mock path is only entered when the caller explicitly opts in
      // (switchTenant({useMock:true,…})). The stored tenant id is read only
      // as a hint for the stale-while-revalidate cache key — the cache paint
      // is overwritten by the live response anyway.
      const useMock = opts.useMock === true;
      const storedTenant = await getJSON(storageKeys.tenant);
      const cacheHintId = opts.tenantId || storedTenant?.id || TENANT_PHARMA;

      // Stale-while-revalidate: paint cache immediately if available. The
      // cached payload's `tenant.id` is whatever was detected on the previous
      // run — we trust it for the first frame and then let the live response
      // correct it in the background.
      const cached = await loadCachedSplash(cacheHintId);
      if (cached?.payload) {
        const cachedTenantId = cached.payload.tenant?.id || cacheHintId;
        setSplashData(cached.payload);
        setStatus('ready');
        setBootstrapStatus('ready');
        warmTags(cached.payload);
        // background revalidate — only call setTenant if the live response
        // changes the tenant id, otherwise we needlessly clear the cart on
        // every cold start (which can also confuse Expo Go's fast refresh).
        fetchSplash({ credentials: creds, useMock })
          .then((fresh) => {
            const detected = useMock
              ? fresh.tenant?.id || cachedTenantId
              : detectTenantId(fresh.tenant.domainConfig);
            const next = { ...fresh, tenant: { ...fresh.tenant, id: detected } };
            persistSplash(detected, next).catch(() => {});
            setSplashData(next);
            if (detected !== cachedTenantId) {
              setTenant(next.tenant).catch(() => {});
            }
            warmTags(next);
          })
          .catch(() => {});
        return;
      }

      // No cache — must fetch blocking. Tenant comes from the response.
      const fresh = await fetchSplash({ credentials: creds, useMock });
      const detected = useMock
        ? fresh.tenant?.id || cacheHintId
        : detectTenantId(fresh.tenant.domainConfig);
      const next = { ...fresh, tenant: { ...fresh.tenant, id: detected } };
      await persistSplash(detected, next);
      setSplashData(next);
      await setTenant(next.tenant);
      setStatus('ready');
      setBootstrapStatus('ready');
      warmTags(next);
    } catch (e) {
      setError(e);
      setStatus('error');
      setBootstrapStatus('error');
    }
  }, [setSplashData, setBootstrapStatus, setTenant, warmTags]);

  // First-mount: load creds, then run.
  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await getJSON(storageKeys.credentials);
      const creds = stored || DEFAULT_CREDENTIALS;
      if (!alive) return;
      setCredentials(creds);
      setStoreCredentials(creds);
      await run(creds);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(() => {
    if (credentials) run(credentials);
  }, [credentials, run]);

  // Imperative tenant switch — exposed via window-on-store for now,
  // wrapped by AccountScreen / StoreSwitcherScreen. Restaurant is mock-only
  // today; pharma always hits the live API. Callers may pass an explicit
  // `useMock` to force the path; otherwise it's inferred from the target id.
  const switchTenant = useCallback(
    async ({ tenantId, credentials: nextCreds, useMock }) => {
      const creds = nextCreds || credentials;
      if (nextCreds) {
        await setJSON(storageKeys.credentials, nextCreds);
        setCredentials(nextCreds);
        setStoreCredentials(nextCreds);
      }
      setForcedTenantId(tenantId || null);
      const resolvedUseMock =
        typeof useMock === 'boolean' ? useMock : tenantId === TENANT_RESTAURANT;
      await run(creds, { tenantId, useMock: resolvedUseMock });
    },
    [credentials, run, setStoreCredentials],
  );

  // Expose retry+switch via a context stub. Cheap — only screens that need
  // them (Account, StoreSwitcher) will read.
  const ctx = React.useMemo(() => ({ retry, switchTenant, status, error }), [
    retry,
    switchTenant,
    status,
    error,
  ]);

  if (status === 'loading') {
    return (
      <BootstrapContext.Provider value={ctx}>
        <BootstrapLoadingScreen />
      </BootstrapContext.Provider>
    );
  }
  if (status === 'error') {
    return (
      <BootstrapContext.Provider value={ctx}>
        <BootstrapErrorScreen error={error} onRetry={retry} />
      </BootstrapContext.Provider>
    );
  }
  return <BootstrapContext.Provider value={ctx}>{children}</BootstrapContext.Provider>;
}

export const BootstrapContext = React.createContext({
  retry: () => {},
  switchTenant: async () => {},
  status: 'idle',
  error: null,
});

export function useBootstrap() {
  return React.useContext(BootstrapContext);
}
