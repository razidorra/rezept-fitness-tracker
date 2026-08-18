// API-Aufrufe fürs Recipes-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Siehe server/spec.md, Abschnitt "Recipes" für Request/Response-Format.

import { apiRequest } from "../../../shared/api/apiClient.js";

export function searchRecipes(query) {
  return apiRequest(`/recipes/search?${new URLSearchParams({ query })}`, { auth: true });
}

export function saveRecipe(recipeData) {
  return apiRequest("/recipes", { method: "POST", auth: true, body: recipeData });
}

export function getSavedRecipes() {
  return apiRequest("/recipes", { auth: true });
}

export function deleteRecipe(id) {
  return apiRequest(`/recipes/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}
