const REQUEST_TIMEOUT_MS = 10_000;
const USER_AGENT = "FitMeal/1.0 (student fitness and nutrition project)";
const WGER_CACHE_MS = 60 * 60 * 1000;
const FOOD_CACHE_MS = 15 * 60 * 1000;

let exerciseCache = { expiresAt: 0, items: [] };
const foodCache = new Map();

async function getJson(url, source) {
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (cause) {
    const error = new Error(`${source} ist momentan nicht erreichbar`, { cause });
    error.status = 502;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`${source}-Anfrage fehlgeschlagen (${response.status})`);
    error.status = 502;
    throw error;
  }
  return response.json();
}

function numberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number * 10) / 10 : null;
}

export async function searchFoods(query) {
  const cacheKey = query.toLocaleLowerCase();
  const cached = foodCache.get(cacheKey);
  if (cached?.expiresAt > Date.now()) return cached.items;

  let items;
  try {
    items = await searchOpenFoodFacts(query);
  } catch (error) {
    console.warn("Open Food Facts nicht verfügbar, nutze USDA-Fallback:", error.message);
    items = await searchUsdaFoods(query);
  }
  foodCache.set(cacheKey, { expiresAt: Date.now() + FOOD_CACHE_MS, items });
  return items;
}

async function searchOpenFoodFacts(query) {
  const url = new URL("https://world.openfoodfacts.org/cgi/search.pl");
  url.searchParams.set("search_terms", query);
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", "12");
  url.searchParams.set("fields", "code,product_name,brands,image_front_small_url,nutrition_grades,nutriments");

  const data = await getJson(url, "Open Food Facts");
  return (data.products || [])
    .filter((product) => product.code && product.product_name)
    .map((product) => ({
      id: String(product.code),
      name: product.product_name,
      brand: product.brands || "",
      imageUrl: product.image_front_small_url || "",
      nutritionGrade: product.nutrition_grades || null,
      per: "100 g",
      calories: numberOrNull(product.nutriments?.["energy-kcal_100g"]),
      protein: numberOrNull(product.nutriments?.proteins_100g),
      carbs: numberOrNull(product.nutriments?.carbohydrates_100g),
      fat: numberOrNull(product.nutriments?.fat_100g),
      sourceUrl: `https://world.openfoodfacts.org/product/${encodeURIComponent(product.code)}`,
      source: "Open Food Facts",
    }));
}

function findUsdaNutrient(food, nutrientNumber) {
  return numberOrNull(food.foodNutrients?.find((nutrient) => nutrient.nutrientNumber === nutrientNumber)?.value);
}

async function searchUsdaFoods(query) {
  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  url.searchParams.set("api_key", process.env.USDA_API_KEY || "DEMO_KEY");
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", "12");
  const data = await getJson(url, "USDA FoodData Central");
  return (data.foods || []).map((food) => ({
    id: `usda:${food.fdcId}`,
    name: food.description,
    brand: food.brandName || food.brandOwner || "",
    imageUrl: "",
    nutritionGrade: null,
    per: "100 g",
    calories: findUsdaNutrient(food, "208"),
    protein: findUsdaNutrient(food, "203"),
    carbs: findUsdaNutrient(food, "205"),
    fat: findUsdaNutrient(food, "204"),
    sourceUrl: `https://fdc.nal.usda.gov/food-details/${food.fdcId}/nutrients`,
    source: "USDA FoodData Central",
  }));
}

async function getExerciseTranslations() {
  if (exerciseCache.expiresAt > Date.now()) return exerciseCache.items;

  const url = new URL("https://wger.de/api/v2/exercise-translation/");
  url.searchParams.set("language", "2");
  url.searchParams.set("limit", "5000");
  const data = await getJson(url, "wger");
  exerciseCache = {
    expiresAt: Date.now() + WGER_CACHE_MS,
    items: data.results || [],
  };
  return exerciseCache.items;
}

export async function searchExercises(query) {
  const normalizedQuery = query.toLocaleLowerCase("en");
  const exercises = await getExerciseTranslations();
  return exercises
    .filter((exercise) => exercise.name?.toLocaleLowerCase("en").includes(normalizedQuery))
    .sort((a, b) => {
      const aStarts = a.name.toLocaleLowerCase("en").startsWith(normalizedQuery) ? 0 : 1;
      const bStarts = b.name.toLocaleLowerCase("en").startsWith(normalizedQuery) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .slice(0, 12)
    .map((exercise) => ({
      id: String(exercise.exercise),
      name: exercise.name,
      description: (exercise.description_source || "").trim().slice(0, 600),
      sourceUrl: `https://wger.de/en/exercise/${exercise.exercise}/view`,
      source: "wger",
    }));
}

function normalizeMeal(meal) {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`]?.trim();
    if (!name) continue;
    ingredients.push({ name, measure: meal[`strMeasure${index}`]?.trim() || "" });
  }
  return {
    id: String(meal.idMeal),
    name: meal.strMeal,
    imageUrl: meal.strMealThumb || "",
    category: meal.strCategory || "",
    area: meal.strArea || "",
    instructions: meal.strInstructions?.trim() || "",
    sourceUrl: meal.strSource || "",
    ingredients,
    source: "TheMealDB",
  };
}

export async function findMeals(query) {
  if (query) {
    const url = new URL("https://www.themealdb.com/api/json/v1/1/search.php");
    url.searchParams.set("s", query);
    const data = await getJson(url, "TheMealDB");
    return (data.meals || []).slice(0, 8).map(normalizeMeal);
  }

  const requests = Array.from({ length: 6 }, () =>
    getJson("https://www.themealdb.com/api/json/v1/1/random.php", "TheMealDB"),
  );
  const results = await Promise.all(requests);
  const uniqueMeals = new Map();
  results.flatMap((result) => result.meals || []).forEach((meal) => {
    uniqueMeals.set(meal.idMeal, normalizeMeal(meal));
  });
  return [...uniqueMeals.values()];
}
