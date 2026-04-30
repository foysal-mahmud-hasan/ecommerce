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
  const { setSplashData, setBootstrapStatus, setTenant } = useStore();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [, setForcedTenantId] = useState(null);

  const run = useCallback(async (creds, opts = {}) => {
    setStatus('loading');
    setError(null);
    setBootstrapStatus('loading');
    try {
      // Decide tenant from stored hint (if any) — restaurant uses mock data,
      // pharma hits the real API with creds.
      const storedTenant = await getJSON(storageKeys.tenant);
      const knownTenantId = opts.tenantId || storedTenant?.id || TENANT_PHARMA;
      const useMock = knownTenantId === TENANT_RESTAURANT;

      // Stale-while-revalidate: paint cache immediately if available.
      const cached = await loadCachedSplash(knownTenantId);
      if (cached?.payload) {
        setSplashData(cached.payload);
        setStatus('ready');
        setBootstrapStatus('ready');
        // background revalidate — only call setTenant if the tenant id
        // actually changed, otherwise we needlessly clear the cart on every
        // cold start (which can also confuse Expo Go's fast refresh).
        fetchSplash({ credentials: creds, useMock })
          .then((fresh) => {
            const detected = useMock ? knownTenantId : detectTenantId(fresh.tenant.domainConfig);
            const next = { ...fresh, tenant: { ...fresh.tenant, id: detected } };
            persistSplash(detected, next).catch(() => {});
            setSplashData(next);
            if (detected !== knownTenantId) {
              setTenant(next.tenant).catch(() => {});
            }
          })
          .catch(() => {});
        return;
      }

      // No cache — must fetch blocking.
      const fresh = await fetchSplash({ credentials: creds, useMock });
      const detected = useMock ? knownTenantId : detectTenantId(fresh.tenant.domainConfig);
      const next = { ...fresh, tenant: { ...fresh.tenant, id: detected } };
      await persistSplash(detected, next);
      setSplashData(next);
      await setTenant(next.tenant);
      setStatus('ready');
      setBootstrapStatus('ready');
    } catch (e) {
      setError(e);
      setStatus('error');
      setBootstrapStatus('error');
    }
  }, [setSplashData, setBootstrapStatus, setTenant]);

  // First-mount: load creds, then run.
  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await getJSON(storageKeys.credentials);
      const creds = stored || DEFAULT_CREDENTIALS;
      if (!alive) return;
      setCredentials(creds);
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
  // wrapped by AccountScreen / StoreSwitcherScreen.
  const switchTenant = useCallback(
    async ({ tenantId, credentials: nextCreds }) => {
      const creds = nextCreds || credentials;
      if (nextCreds) {
        await setJSON(storageKeys.credentials, nextCreds);
        setCredentials(nextCreds);
      }
      setForcedTenantId(tenantId || null);
      await run(creds, { tenantId });
    },
    [credentials, run],
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
