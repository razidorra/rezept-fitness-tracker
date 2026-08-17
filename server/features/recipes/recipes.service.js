// Business-Logik fürs Recipes-Feature: externe Rezept-API (Spoonacular) abfragen,
// Rezepte für einen User speichern/lesen/löschen.
// Wird von recipes.controller.js aufgerufen.

import SavedRecipe from "./recipe.model.js";

const SPOONACULAR_BASE_URL = "https://api.spoonacular.com/recipes";

export async function searchExternalRecipes(query) {
  const url = new URL(`${SPOONACULAR_BASE_URL}/complexSearch`);
  url.searchParams.set("query", query);
  url.searchParams.set("addRecipeNutrition", "true");
  url.searchParams.set("number", "10");
  url.searchParams.set("apiKey", process.env.SPOONACULAR_API_KEY);

  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Spoonacular-Anfrage fehlgeschlagen (${response.status})`);
    error.status = 502;
    throw error;
  }

  const data = await response.json();

  return (data.results || []).map((recipe) => ({
    externalId: String(recipe.id),
    title: recipe.title,
    imageUrl: recipe.image,
    calories: findNutrient(recipe, "Calories"),
    protein: findNutrient(recipe, "Protein"),
    carbs: findNutrient(recipe, "Carbohydrates"),
    fat: findNutrient(recipe, "Fat"),
  }));
}

function findNutrient(recipe, name) {
  const nutrient = recipe.nutrition?.nutrients?.find((n) => n.name === name);
  return nutrient ? Math.round(nutrient.amount) : undefined;
}

export function saveRecipeForUser(userId, recipeData) {
  return SavedRecipe.create({ ...recipeData, user: userId });
}

export function getSavedRecipesForUser(userId) {
  return SavedRecipe.find({ user: userId }).sort({ createdAt: -1 });
}

export function deleteSavedRecipe(userId, recipeId) {
  return SavedRecipe.findOneAndDelete({ _id: recipeId, user: userId });
}
