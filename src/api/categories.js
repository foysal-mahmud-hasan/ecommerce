// Categories arrive in the splash payload and are already normalized into the
// store. Screens read from the store directly; this function is kept as a
// passthrough so callers that still want a Promise interface keep working.
export async function listCategories({ categories }) {
  return categories || [];
}
