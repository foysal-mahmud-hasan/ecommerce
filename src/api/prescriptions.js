// Mock prescription submission. Saves to per-tenant AsyncStorage so the user's
// uploads persist across launches and don't bleed between tenants. Real backend
// integration drops in here later (POST multipart/form-data).
import { getJSON, setJSON, storageKeys } from './storage';

export async function submitPrescription({ tenantId, fileUri, fileMime, name, phone, address }) {
  if (!tenantId) throw new Error('No active store');
  if (!fileUri) throw new Error('Please upload your prescription image');
  if (!phone || phone.replace(/\D/g, '').length < 7) throw new Error('A valid phone number is required');
  if (!address || address.trim().length < 4) throw new Error('Please add a delivery address');

  const id = `rx_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const submittedAt = new Date().toISOString();
  const entry = { id, tenantId, submittedAt, fileUri, fileMime, name, phone, address, status: 'received' };

  const list = (await getJSON(storageKeys.prescriptions(tenantId))) || [];
  await setJSON(storageKeys.prescriptions(tenantId), [entry, ...list].slice(0, 50));

  return { id, submittedAt };
}

export async function listPrescriptions(tenantId) {
  if (!tenantId) return [];
  return (await getJSON(storageKeys.prescriptions(tenantId))) || [];
}
