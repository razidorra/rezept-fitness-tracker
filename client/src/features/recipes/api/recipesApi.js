// API-Aufrufe fürs Recipes-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Siehe server/spec.md, Abschnitt "Recipes" für Request/Response-Format.

// TODO: searchRecipes(query) -> apiRequest(`/recipes/search?query=${query}`, { auth: true })
// TODO: saveRecipe(recipeData) -> apiRequest("/recipes", { method: "POST", auth: true, body: recipeData })
// TODO: getSavedRecipes() -> apiRequest("/recipes", { auth: true })
// TODO: deleteRecipe(id) -> apiRequest(`/recipes/${id}`, { method: "DELETE", auth: true })
