// TODO: wire this up to the real backend once it's worth it:
// searchRecipes(query) -> GET /api/recipes/search?query=... (Spoonacular-backed,
// see server/spec.md "Recipes"), saveRecipe() -> POST /api/recipes,
// getSavedRecipes() -> GET /api/recipes. RECIPES below is placeholder data so
// the page has something to render -- swap it for real search results /
// saved recipes once recipesApi.js's TODOs are implemented.
//
// Layout: this page renders its own full-page sidebar+topbar shell (see the
// `fixed inset-0` wrapper below) instead of using App.jsx's top navbar --
// that was a deliberate scope call: only /recipes gets this look for now,
// so it "escapes" the parent <header>/<main> via fixed positioning rather
// than fighting it for space. If this shell spreads to more pages later,
// promote it into App.jsx instead of copy-pasting.
//
// Photos: client/src/assets/recipes/*.jpg, mostly from Pexels (search terms
// noted per recipe below), resized to 640x640 JPEGs. chicken-quinoa-bowl.jpg
// reuses the landing page's hero-bowl.jpg. No API key needed -- these are
// static bundled images, not live search results.

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
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
  },
  {
    id: "berry-yogurt-parfait",
    title: "Berry Yogurt Parfait",
    image: parfait,
    category: "desserts",
    tags: ["Vegetarian", "Gluten Free"],
    time: "10 min",
    kcal: 290,
    protein: 9,
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

// Sidebar-Links -- Home/Recipes/Workouts existieren schon, der Rest sind neue
// Platzhalter-Seiten (siehe features/nutrition, features/meal-planner, etc.),
// extra für diesen Sidebar-Mock angelegt.
const SIDEBAR_LINKS = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Recipes", to: "/recipes", icon: BookIcon },
  { label: "Workouts", to: "/workouts", icon: DumbbellIcon },
  { label: "Nutrition", to: "/nutrition", icon: UtensilsIcon },
  { label: "Meal Planner", to: "/meal-planner", icon: CalendarIcon },
  { label: "Progress", to: "/progress", icon: ChartIcon },
  { label: "Favorites", to: "/favorites", icon: HeartIcon },
  { label: "Shopping List", to: "/shopping-list", icon: CartIcon },
];

export default function RecipesPage() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Recipes");
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(() => new Set());

  const visible = RECIPES.filter((recipe) => {
    const matchesFilter =
      activeFilter === "All Recipes" || recipe.tags.includes(activeFilter);
    const matchesCategory =
      activeCategory === "all" || recipe.category === activeCategory;
    const matchesQuery = recipe.title
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    return matchesFilter && matchesCategory && matchesQuery;
  });

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="fixed inset-0 z-40 flex bg-bg text-text">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 -translate-x-full flex-col border-r border-border bg-surface p-5 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : ""
        }`}
      >
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path
                d="M12 20.5c-.3 0-.6-.1-.8-.3-2.2-1.9-4.1-3.6-5.5-5.3C4.1 13 3 11.1 3 9.2 3 6.6 5 4.6 7.5 4.6c1.4 0 2.7.6 3.6 1.7l.9 1 .9-1c.9-1.1 2.2-1.7 3.6-1.7 2.5 0 4.5 2 4.5 4.6 0 1.9-1.1 3.8-2.7 5.7-1.4 1.7-3.3 3.4-5.5 5.3-.2.2-.5.3-.8.3Z"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-lg font-extrabold text-text-h">
            Fit<span className="text-accent">Meal</span>
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const active = link.to === "/recipes";
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-accent-bg text-accent"
                    : "text-text hover:bg-bg hover:text-text-h"
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-lg bg-accent-bg p-4 text-center">
            <p className="mb-1 text-sm font-semibold text-text-h">
              Go Premium
            </p>
            <p className="mb-3 text-xs text-text">
              Unlock more features and achieve your goals faster.
            </p>
            <button
              type="button"
              className="w-full rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-opacity hover:opacity-85"
            >
              Upgrade Now
            </button>
          </div>
          <Link
            to="/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text hover:bg-bg hover:text-text-h"
          >
            <GearIcon />
            Settings
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-4 border-b border-border bg-surface px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            className="text-text-h md:hidden"
          >
            <MenuIcon />
          </button>

          <div className="relative flex-1 max-w-xl">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full rounded-pill border border-border bg-bg py-2 pr-4 pl-10 text-sm text-text-h outline-none focus:border-accent-border"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="hidden text-text hover:text-text-h sm:block"
          >
            <BellIcon />
          </button>
          <button
            type="button"
            aria-label="Calendar"
            className="hidden text-text hover:text-text-h sm:block"
          >
            <CalendarIcon />
          </button>

          <div className="flex items-center gap-2">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt=""
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-bg text-sm font-semibold text-text-h">
                {(user?.firstName ?? "?").slice(0, 1)}
              </span>
            )}
            <span className="hidden text-sm font-medium text-text-h md:block">
              {user?.fullName ?? user?.firstName ?? "Account"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <h1 className="mb-1! text-2xl! sm:text-3xl!">Recipes</h1>
          <p className="text-text">
            Discover healthy and delicious recipes to fuel your goals.
          </p>

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
                <div
                  key={recipe.id}
                  className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="aspect-square w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFavorite(recipe.id)}
                      aria-label={
                        favorites.has(recipe.id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm"
                    >
                      <HeartIcon filled={favorites.has(recipe.id)} />
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
                    <div className="mt-3 flex items-center gap-3 text-xs text-text">
                      <span className="flex items-center gap-1">
                        <ClockIcon /> {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <FlameIcon /> {recipe.kcal} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <BoltIcon /> {recipe.protein}g Protein
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="rounded-pill border border-border bg-surface px-6 py-2.5 text-sm font-medium text-text-h hover:border-accent-border"
            >
              Load More Recipes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-4.3-4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M6 10a6 6 0 1 1 12 0c0 3.5 1 5 1.5 6H4.5C5 15 6 13.5 6 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path
        d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3 1.8-4.9 2.9-7.1.5-1 .8-2 .8-3.2 2 1 3.3 3 3.3 5.3 1.6-1.1 2-2.8 2-4.3 2.3 1.6 3.5 4.6 3.5 7.3 0 4.4-2.6 8.2-6 8.2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path
        d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A1.5 1.5 0 0 1 18.5 20H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 9v6M2 10.5v3M8 7v10M16 7v10M20 10.5v3M22 9v6M8 12h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M7 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M9 3v18M17 3c-1.7 0-3 2.5-3 5.5S15.3 14 17 14s3-2.5 3-5.5S18.7 3 17 3ZM17 14v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 9.5h17M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 20V10M11 20V4M18 20v-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L20.5 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="21" r="1.4" fill="currentColor" />
      <circle cx="17" cy="21" r="1.4" fill="currentColor" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3.5v2M12 18.5v2M4.9 6.9l1.4 1.4M17.7 15.7l1.4 1.4M3.5 12h2M18.5 12h2M4.9 17.1l1.4-1.4M17.7 8.3l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M12 20.5c-.3 0-.6-.1-.8-.3-2.2-1.9-4.1-3.6-5.5-5.3C4.1 13 3 11.1 3 9.2 3 6.6 5 4.6 7.5 4.6c1.4 0 2.7.6 3.6 1.7l.9 1 .9-1c.9-1.1 2.2-1.7 3.6-1.7 2.5 0 4.5 2 4.5 4.6 0 1.9-1.1 3.8-2.7 5.7-1.4 1.7-3.3 3.4-5.5 5.3-.2.2-.5.3-.8.3Z"
        stroke={filled ? "#ef4444" : "currentColor"}
        fill={filled ? "#ef4444" : "none"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
