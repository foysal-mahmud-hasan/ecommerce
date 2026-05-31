// Toggle real vs mock implementations per resource. The splash endpoint is
// always real today. Everything else is mock — flip these when backend
// fragments the API.
export const featureFlags = {
  useRealSplashApi: true,
  useRealCategoriesApi: true,
  useRealProductsApi: true,
  useRealAuthApi: true,
  useRealOrdersApi: true,
};
