import { featureFlags } from '../config/featureFlags';

export async function listCategories({ categories }) {
  if (featureFlags.useRealCategoriesApi) {
    throw new Error('Real categories API not wired yet');
  }
  return categories || [];
}
