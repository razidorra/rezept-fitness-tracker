import test from "node:test";
import assert from "node:assert/strict";
import { foods as foodsController } from "../features/catalog/catalog.controller.js";
import { findMeals, searchExercises, searchFoods } from "../features/catalog/catalog.service.js";

function responseDouble() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("Katalog weist zu kurze Suchbegriffe ab", () => {
  const response = responseDouble();
  foodsController({ query: { query: "a" } }, response);
  assert.equal(response.statusCode, 400);
  assert.match(response.body.error, /2 bis 100/);
});

test("Open-Food-Facts-Daten werden auf das interne Format reduziert", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ products: [{
      code: "123",
      product_name: "Test yogurt",
      brands: "FitMeal",
      nutriments: { "energy-kcal_100g": 99.94, proteins_100g: 8, carbohydrates_100g: 12, fat_100g: 2 },
    }] }),
  });

  const [food] = await searchFoods("yogurt");
  assert.deepEqual(food, {
    id: "123", name: "Test yogurt", brand: "FitMeal", imageUrl: "",
    nutritionGrade: null, per: "100 g", calories: 99.9, protein: 8,
    carbs: 12, fat: 2, sourceUrl: "https://world.openfoodfacts.org/product/123",
    source: "Open Food Facts",
  });
});

test("USDA übernimmt automatisch, wenn Open Food Facts nicht verfügbar ist", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  let calls = 0;
  global.fetch = async () => {
    calls += 1;
    if (calls === 1) return { ok: false, status: 503 };
    return { ok: true, json: async () => ({ foods: [{
      fdcId: 99,
      description: "BANANA, RAW",
      foodNutrients: [
        { nutrientNumber: "208", value: 89 },
        { nutrientNumber: "203", value: 1.1 },
      ],
    }] }) };
  };

  const [food] = await searchFoods("unique fallback banana");
  assert.equal(calls, 2);
  assert.equal(food.source, "USDA FoodData Central");
  assert.equal(food.calories, 89);
});

test("wger-Übungen werden gesucht und TheMealDB-Zutaten normalisiert", async (t) => {
  const originalFetch = global.fetch;
  t.after(() => { global.fetch = originalFetch; });
  global.fetch = async (url) => {
    if (String(url).includes("wger")) {
      return { ok: true, json: async () => ({ results: [
        { exercise: 1, name: "Goblet Squat", description_source: "Keep the chest up." },
        { exercise: 2, name: "Bench Press", description_source: "Press." },
      ] }) };
    }
    return { ok: true, json: async () => ({ meals: [{
      idMeal: "42", strMeal: "Test bowl", strCategory: "Vegan", strArea: "Global",
      strIngredient1: "Rice", strMeasure1: "1 cup", strIngredient2: "", strMeasure2: "",
    }] }) };
  };

  const exercises = await searchExercises("squat");
  const meals = await findMeals("bowl");
  assert.equal(exercises[0].name, "Goblet Squat");
  assert.deepEqual(meals[0].ingredients, [{ name: "Rice", measure: "1 cup" }]);
});
