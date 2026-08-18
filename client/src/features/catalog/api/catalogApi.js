import { apiRequest } from "../../../shared/api/apiClient.js";

function queryPath(type, query) {
  const search = new URLSearchParams();
  if (query) search.set("query", query);
  return `/catalog/${type}${search.size ? `?${search}` : ""}`;
}

export function searchFoods(query) {
  return apiRequest(queryPath("foods", query));
}

export function searchExercises(query) {
  return apiRequest(queryPath("exercises", query));
}

export function findMeals(query = "") {
  return apiRequest(queryPath("meals", query)).catch((error) => {
    // Older local server processes may not yet expose /api/catalog/meals.
    // TheMealDB is public, so keep recipe inspiration usable in that case.
    if (error.status === 404 || error instanceof TypeError) return findMealsDirectly(query);
    throw error;
  });
}

async function findMealsDirectly(query) {
  const urls = query
    ? [`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`]
    : Array.from({ length: 6 }, () => "https://www.themealdb.com/api/json/v1/1/random.php");
  const responses = await Promise.all(urls.map(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`TheMealDB request failed (${response.status})`);
    return response.json();
  }));
  const uniqueMeals = new Map();
  responses.flatMap((data) => data.meals || []).forEach((meal) => {
    uniqueMeals.set(meal.idMeal, normalizeMeal(meal));
  });
  return [...uniqueMeals.values()].slice(0, 8);
}

function normalizeMeal(meal) {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`]?.trim();
    if (name) ingredients.push({ name, measure: meal[`strMeasure${index}`]?.trim() || "" });
  }
  return {
    id: String(meal.idMeal),
    name: meal.strMeal,
    imageUrl: meal.strMealThumb || "",
    category: meal.strCategory || "",
    area: meal.strArea || "",
    instructions: meal.strInstructions?.trim() || "",
    sourceUrl: meal.strSource || `https://www.themealdb.com/meal/${meal.idMeal}`,
    ingredients,
    source: "TheMealDB",
  };
}
