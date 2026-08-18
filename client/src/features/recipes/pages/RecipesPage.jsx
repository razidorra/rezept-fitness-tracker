// Der lokale Katalog ist sofort verfügbar. "Search online" fragt die kostenlose
// TheMealDB-Suche ab; Herz-Buttons speichern dauerhaft in MongoDB.
//
// AppShell provides the shared content width and recipe search field; the
// global header and footer are rendered by App.jsx.
//
// Photos: client/src/assets/recipes/*.jpg, mostly from Pexels (search terms
// noted per recipe below), resized to 640x640 JPEGs. chicken-quinoa-bowl.jpg
// reuses the landing page's hero-bowl.jpg. No API key needed -- these are
// static bundled images, not live search results.

import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import AppShell from "../../../shared/components/AppShell.jsx";
import { HeartIcon, ClockIcon, FlameIcon, BoltIcon } from "../../../shared/components/icons.jsx";
import {
  deleteRecipe,
  getSavedRecipes,
  saveRecipe,
} from "../api/recipesApi.js";
import { findMeals } from "../../catalog/api/catalogApi.js";
import { tryAddToDailyPlan } from "../../meal-planner/mealPlanStorage.js";
import chickenQuinoaBowl from "../../../assets/recipes/chicken-quinoa-bowl.jpg";
import oatmeal from "../../../assets/recipes/oatmeal.jpg";
import salmon from "../../../assets/recipes/salmon.jpg";
import chickpeaSalad from "../../../assets/recipes/chickpea-salad.jpg";
import avocadoToast from "../../../assets/recipes/avocado-toast.jpg";
import smoothie from "../../../assets/recipes/smoothie.jpg";
import stirfry from "../../../assets/recipes/stirfry.jpg";
import parfait from "../../../assets/recipes/parfait.jpg";

const RECIPES = [
  {
    id: "chicken-quinoa-bowl",
    title: "Grilled Chicken Quinoa Bowl",
    image: chickenQuinoaBowl,
    category: "lunch",
    tags: ["High Protein", "Gluten Free"],
    time: "35 min",
    kcal: 550,
    protein: 52,
    carbs: 48,
    fat: 16,
    fiber: 9,
    description: "A balanced high-protein bowl with lean chicken, whole-grain quinoa and colorful vegetables.",
    ingredients: ["150 g chicken breast", "100 g cooked quinoa", "100 g broccoli", "½ avocado", "6 cherry tomatoes", "1 tsp olive oil", "Lemon juice, paprika, salt and pepper"],
    instructions: ["Season the chicken and grill it until fully cooked, then slice it.", "Steam the broccoli and warm the cooked quinoa.", "Arrange everything in a bowl with avocado and tomatoes.", "Finish with olive oil and lemon juice."],
  },
  {
    id: "protein-oatmeal",
    title: "Protein Oatmeal",
    image: oatmeal,
    category: "breakfast",
    tags: ["High Protein", "Vegetarian"],
    time: "10 min",
    kcal: 420,
    protein: 28,
    carbs: 52,
    fat: 11,
    fiber: 9,
    description: "Creamy oats with protein, fruit and seeds for a filling breakfast.",
    ingredients: ["60 g rolled oats", "200 ml milk or plant drink", "25 g protein powder", "½ banana", "1 tbsp chia seeds", "Cinnamon"],
    instructions: ["Simmer oats and milk for 5–7 minutes.", "Remove from the heat and stir in protein powder.", "Top with banana, chia seeds and cinnamon."],
  },
  {
    id: "lemon-garlic-salmon",
    title: "Lemon Garlic Salmon",
    image: salmon,
    category: "dinner",
    tags: ["High Protein", "Low Carb"],
    time: "25 min",
    kcal: 580,
    protein: 45,
    carbs: 18,
    fat: 34,
    fiber: 6,
    description: "Omega-3-rich salmon with roasted vegetables and a fresh lemon-garlic finish.",
    ingredients: ["170 g salmon fillet", "200 g mixed vegetables", "1 tsp olive oil", "1 garlic clove", "½ lemon", "Dill, salt and pepper"],
    instructions: ["Heat the oven to 200°C.", "Place salmon and vegetables on a tray and season with oil, garlic, dill, salt and pepper.", "Bake for 15–18 minutes and serve with lemon."],
  },
  {
    id: "chickpea-avocado-salad",
    title: "Chickpea Avocado Salad",
    image: chickpeaSalad,
    category: "lunch",
    tags: ["Vegan", "High Fiber"],
    time: "15 min",
    kcal: 350,
    protein: 15,
    carbs: 44,
    fat: 15,
    fiber: 13,
    description: "A fresh plant-based salad rich in fiber, healthy fats and slow carbohydrates.",
    ingredients: ["150 g cooked chickpeas", "½ avocado", "½ cucumber", "8 cherry tomatoes", "¼ red onion", "Parsley", "Lemon juice, salt and pepper"],
    instructions: ["Rinse and drain the chickpeas.", "Dice the vegetables and avocado.", "Combine everything with parsley and lemon juice, then season."],
  },
  {
    id: "avocado-toast",
    title: "Avocado Toast",
    image: avocadoToast,
    category: "breakfast",
    tags: ["Vegetarian", "Quick & Easy"],
    time: "10 min",
    kcal: 320,
    protein: 12,
    carbs: 36,
    fat: 15,
    fiber: 10,
    description: "Quick whole-grain toast with creamy avocado and a protein-rich egg.",
    ingredients: ["2 slices whole-grain bread", "½ avocado", "1 egg", "Lemon juice", "Chili flakes, salt and pepper"],
    instructions: ["Toast the bread and cook the egg to your preference.", "Mash avocado with lemon, salt and pepper.", "Spread on toast, add the egg and chili flakes."],
  },
  {
    id: "berry-protein-smoothie",
    title: "Berry Protein Smoothie",
    image: smoothie,
    category: "smoothies",
    tags: ["High Protein", "Vegan"],
    time: "5 min",
    kcal: 280,
    protein: 25,
    carbs: 36,
    fat: 5,
    fiber: 8,
    description: "A fast berry smoothie with plant protein and naturally sweet fruit.",
    ingredients: ["150 g frozen mixed berries", "1 small banana", "25 g plant protein powder", "250 ml unsweetened soy drink", "1 tsp ground flaxseed"],
    instructions: ["Add all ingredients to a blender.", "Blend until smooth, adding a little water if needed.", "Serve immediately."],
  },
  {
    id: "veggie-stir-fry",
    title: "Veggie Stir Fry",
    image: stirfry,
    category: "dinner",
    tags: ["Vegetarian", "Low Fat"],
    time: "20 min",
    kcal: 420,
    protein: 22,
    carbs: 58,
    fat: 12,
    fiber: 12,
    description: "Crisp vegetables and tofu in a light ginger-soy sauce.",
    ingredients: ["150 g firm tofu", "250 g mixed stir-fry vegetables", "100 g cooked brown rice", "1 tbsp low-sodium soy sauce", "1 tsp sesame oil", "Ginger and garlic"],
    instructions: ["Sear the diced tofu until golden and set aside.", "Stir-fry the vegetables with ginger and garlic.", "Return tofu to the pan, add soy sauce and sesame oil, and serve with rice."],
  },
  {
    id: "berry-yogurt-parfait",
    title: "Berry Yogurt Parfait",
    image: parfait,
    category: "desserts",
    tags: ["Vegetarian", "Gluten Free"],
    time: "10 min",
    kcal: 290,
    protein: 19,
    carbs: 40,
    fat: 8,
    fiber: 6,
    description: "Greek yogurt layered with berries, oats and nuts for a fresh dessert or breakfast.",
    ingredients: ["200 g Greek yogurt", "120 g mixed berries", "30 g rolled oats", "10 g chopped almonds", "1 tsp honey"],
    instructions: ["Toast the oats briefly in a dry pan if desired.", "Layer yogurt, berries and oats in a glass.", "Top with almonds and honey."],
  },
];

const FILTERS = [
  "All Recipes",
  "High Protein",
  "Low Carb",
  "Low Fat",
  "Vegan",
  "Vegetarian",
  "Quick & Easy",
];

const CATEGORIES = [
  { key: "all", label: "All", emoji: "🍽️" },
  { key: "breakfast", label: "Breakfast", emoji: "☀️" },
  { key: "lunch", label: "Lunch", emoji: "🍔" },
  { key: "dinner", label: "Dinner", emoji: "🍲" },
  { key: "snacks", label: "Snacks", emoji: "🍎" },
  { key: "smoothies", label: "Smoothies", emoji: "🥤" },
  { key: "desserts", label: "Desserts", emoji: "🍰" },
];

export default function RecipesPage() {
  const { isSignedIn, userId } = useAuth();
  const { openSignIn, signOut } = useClerk();
  const [activeFilter, setActiveFilter] = useState("All Recipes");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [planFeedback, setPlanFeedback] = useState(null);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getSavedRecipes()
      .then((recipes) => { setSavedRecipes(recipes); setAuthError(""); })
      .catch((err) => {
        if (err.status === 401) setAuthError(err.message);
        else setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [isSignedIn]);

  useEffect(() => {
    if (!selectedRecipe) return;
    const close = (event) => { if (event.key === "Escape") setSelectedRecipe(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selectedRecipe]);

  const displayedRecipes = searchResults ?? RECIPES;

  const visible = displayedRecipes.filter((recipe) => {
    const matchesFilter =
      activeFilter === "All Recipes" || recipe.tags.includes(activeFilter);
    const matchesCategory =
      activeCategory === "all" || recipe.category === activeCategory;
    const matchesQuery = searchResults
      ? true
      : recipe.title.toLowerCase().includes(query.trim().toLowerCase());
    return matchesFilter && matchesCategory && matchesQuery;
  });

  async function runSearch() {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const results = await findMeals(query.trim());
      setSearchResults(
        results.map((meal) => ({
          id: meal.id,
          externalId: `mealdb:${meal.id}`,
          title: meal.name,
          image: meal.imageUrl,
          category: "all",
          tags: [meal.category, meal.area].filter(Boolean),
          time: "—",
          kcal: null,
          protein: null,
          carbs: null,
          fat: null,
          fiber: null,
          description: meal.instructions ? `${meal.instructions.slice(0, 180)}${meal.instructions.length > 180 ? "…" : ""}` : "Recipe details from TheMealDB.",
          ingredients: meal.ingredients.map((ingredient) => `${ingredient.measure} ${ingredient.name}`.trim()),
          instructions: meal.instructions ? [meal.instructions] : [],
          sourceUrl: meal.sourceUrl || `https://www.themealdb.com/meal/${meal.id}`,
        })),
      );
      setActiveCategory("all");
      setActiveFilter("All Recipes");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openRecipe(recipe) {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setPlanFeedback(null);
    setSelectedRecipe(recipe);
  }

  function addRecipeToPlan(recipe) {
    if (recipe.kcal === null || recipe.kcal === undefined) {
      setPlanFeedback({ type: "warning", text: "This online recipe has no verified calorie values, so it cannot be checked against your daily plan." });
      return;
    }
    const result = tryAddToDailyPlan(userId, {
      id: recipe.id,
      title: recipe.title,
      kcal: recipe.kcal,
      protein: recipe.protein || 0,
      carbs: recipe.carbs || 0,
      fat: recipe.fat || 0,
      amount: "1 serving",
    });
    if (result.status === "profile-required") {
      setPlanFeedback({ type: "warning", text: "Set up your weight, height and activity in the Meal Planner first.", setup: true });
    } else if (result.status === "over-target") {
      setPlanFeedback({ type: "warning", text: `${recipe.title} would put today's plan about ${result.over} kcal above your estimated target. Choose another meal or remove an existing item.` });
    } else {
      setPlanFeedback({ type: "success", text: `${recipe.title} was added. About ${result.remaining} kcal remain in today's plan.` });
    }
  }

  async function reauthenticate() {
    await signOut();
    openSignIn();
  }

  async function toggleFavorite(recipe) {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    const externalId = recipe.externalId ?? `static:${recipe.id}`;
    const saved = savedRecipes.find((item) => item.externalId === externalId);
    setError("");
    try {
      if (saved) {
        await deleteRecipe(saved._id);
        setSavedRecipes((current) => current.filter((item) => item._id !== saved._id));
      } else {
        const created = await saveRecipe({
          externalId,
          title: recipe.title,
          imageUrl: recipe.externalId ? (recipe.image ?? recipe.imageUrl) : undefined,
          calories: recipe.kcal ?? recipe.calories,
          protein: recipe.protein,
          carbs: recipe.carbs,
          fat: recipe.fat,
        });
        setSavedRecipes((current) => [created, ...current]);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppShell
      search={{
        value: query,
        onChange: setQuery,
        onSubmit: runSearch,
        placeholder: "Search recipes, ingredients...",
      }}
    >
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Recipes</h1>
      <p className="text-text">
        Discover healthy and delicious recipes to fuel your goals.
      </p>
      {!isSignedIn && <div className="mt-4 rounded-lg border border-accent-border bg-accent-bg p-4 text-sm text-text-h">You can browse and search freely. Sign in to open ingredients, preparation, nutrition details or save a favorite.</div>}
      {isSignedIn && authError && <div role="alert" className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-amber-400 bg-amber-50 p-4 text-sm text-amber-900"><span>{authError}</span><button type="button" onClick={reauthenticate} className="rounded-pill bg-accent px-4 py-2 font-semibold text-accent-ink">Log in again</button></div>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={runSearch} disabled={loading} className="rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-60">
          {loading ? "Loading…" : "Search healthy recipes online"}
        </button>
        <Link to="/meal-planner" className="rounded-pill border border-border bg-surface px-5 py-2 text-sm font-medium hover:border-accent-border">Open Meal Planner</Link>
        {searchResults && (
          <button type="button" onClick={() => { setSearchResults(null); setQuery(""); }} className="rounded-pill border border-border bg-surface px-5 py-2 text-sm font-medium">
            Show catalog
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`rounded-pill border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === filter
                ? "border-accent bg-accent text-accent-ink"
                : "border-border bg-surface text-text hover:border-accent-border"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setActiveCategory(cat.key)}
            className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? "border-accent bg-accent-bg text-text-h"
                : "border-border bg-surface text-text hover:border-accent-border"
            }`}
          >
            <span className="text-xl">{cat.emoji}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-text">
          No recipes match your search.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((recipe) => (
            <article
              key={recipe.id}
              role="button"
              tabIndex={0}
              onClick={() => openRecipe(recipe)}
              onKeyDown={(event) => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); openRecipe(recipe); } }}
              className="cursor-pointer overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:border-accent-border hover:shadow-lg focus-visible:outline-2 focus-visible:outline-accent"
            >
              <div className="relative">
                {recipe.image ? <img src={recipe.image} alt={recipe.title} className="aspect-square w-full object-cover" /> : <div className="flex aspect-square items-center justify-center bg-accent-bg text-4xl" aria-label={recipe.title}>🍽️</div>}
                <button
                  type="button"
                  onClick={(event) => { event.stopPropagation(); toggleFavorite(recipe); }}
                  aria-label={
                    savedRecipes.some((item) => item.externalId === (recipe.externalId ?? `static:${recipe.id}`))
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm"
                >
                  <HeartIcon filled={savedRecipes.some((item) => item.externalId === (recipe.externalId ?? `static:${recipe.id}`))} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="mb-1! text-base! font-medium text-text-h">
                  {recipe.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {recipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-pill bg-accent-bg px-2 py-0.5 text-[11px] font-medium text-text-h"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {!isSignedIn ? <p className="mt-3 text-xs text-text">🔒 Ingredients, preparation and nutrition</p> : recipe.sourceUrl ? <p className="mt-3 text-xs text-text">Online recipe from TheMealDB</p> : <div className="mt-3 flex items-center gap-3 text-xs text-text">
                  <span className="flex items-center gap-1">
                    <ClockIcon /> {recipe.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <FlameIcon /> {recipe.kcal ?? "—"} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <BoltIcon /> {recipe.protein ?? "—"}g Protein
                  </span>
                </div>}
                {isSignedIn ? <p className="mt-3 text-xs font-semibold text-accent">Click for ingredients, preparation and nutrition →</p> : <p className="mt-3 text-xs font-semibold text-accent">Log in to view full recipe →</p>}
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedRecipe && isSignedIn && <RecipeDetails recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} onAddToPlan={addRecipeToPlan} planFeedback={planFeedback} />}
    </AppShell>
  );
}

function RecipeDetails({ recipe, onClose, onAddToPlan, planFeedback }) {
  const nutrients = [
    ["Calories", recipe.kcal, "kcal"],
    ["Protein", recipe.protein, "g"],
    ["Carbs", recipe.carbs, "g"],
    ["Fat", recipe.fat, "g"],
    ["Fiber", recipe.fiber, "g"],
  ];
  const hasCompleteNutrition = nutrients.every(([, value]) => value !== null && value !== undefined);

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
    <article role="dialog" aria-modal="true" aria-labelledby="recipe-detail-title" onClick={(event) => event.stopPropagation()} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg border border-border bg-bg shadow-xl">
      <div className="relative grid md:grid-cols-2">
        {recipe.image ? <img src={recipe.image} alt={recipe.title} className="h-full max-h-96 w-full object-cover md:max-h-none" /> : <div className="flex min-h-64 items-center justify-center bg-accent-bg text-6xl">🍽️</div>}
        <div className="p-6 sm:p-8">
          <button type="button" onClick={onClose} aria-label="Close recipe" className="float-right flex h-9 w-9 items-center justify-center rounded-full border border-border text-xl">×</button>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">{recipe.tags?.join(" · ") || "Online recipe"}</p>
          <h2 id="recipe-detail-title" className="mt-2 pr-10 text-2xl!">{recipe.title}</h2>
          <p className="mt-3 text-sm text-text">{recipe.description}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5">{nutrients.map(([label, value, unit]) => <div key={label} className="rounded-md border border-border bg-surface p-3 text-center"><p className="text-xs text-text">{label}</p><p className="mt-1 font-semibold text-text-h">{value ?? "—"}{value !== null && value !== undefined ? ` ${unit}` : ""}</p></div>)}</div>
          {!hasCompleteNutrition && <p className="mt-3 text-xs text-text">The external recipe provider does not supply verified nutrition values for this meal.</p>}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section><h3 className="text-lg!">Ingredients</h3>{recipe.ingredients?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{recipe.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul> : <p className="mt-2 text-sm">No ingredients provided.</p>}</section>
            <section><h3 className="text-lg!">Preparation</h3>{recipe.instructions?.length ? <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm">{recipe.instructions.map((step, index) => <li key={index} className="whitespace-pre-line">{step}</li>)}</ol> : <p className="mt-2 text-sm">No preparation provided.</p>}</section>
          </div>
          {planFeedback && <div role={planFeedback.type === "warning" ? "alert" : "status"} className={`mt-6 rounded-md border p-4 text-sm ${planFeedback.type === "warning" ? "border-amber-400 bg-amber-50 text-amber-900" : "border-accent-border bg-accent-bg text-text-h"}`}>{planFeedback.text}{planFeedback.setup && <Link to="/meal-planner" onClick={onClose} className="ml-2 font-semibold text-accent underline">Set up Meal Planner</Link>}</div>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => onAddToPlan(recipe)} disabled={recipe.kcal === null || recipe.kcal === undefined} className="rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-50">Add to today’s meal plan</button>{recipe.sourceUrl && <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-pill border border-accent-border px-4 py-2 text-sm font-semibold text-accent">View original source ↗</a>}</div>
          {(recipe.kcal === null || recipe.kcal === undefined) && <p className="mt-2 text-xs text-text">Meal-plan check unavailable because the source provides no verified calories.</p>}
        </div>
      </div>
    </article>
  </div>;
}
