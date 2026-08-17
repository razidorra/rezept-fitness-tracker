import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import App from "./App.jsx";
import HomePage from "./features/dashboard/pages/HomePage.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import RecipesPage from "./features/recipes/pages/RecipesPage.jsx";
import TrackingPage from "./features/tracking/pages/TrackingPage.jsx";
import WorkoutsPage from "./features/workouts/pages/WorkoutsPage.jsx";
import NutritionPage from "./features/nutrition/pages/NutritionPage.jsx";
import MealPlannerPage from "./features/meal-planner/pages/MealPlannerPage.jsx";
import ProgressPage from "./features/progress/pages/ProgressPage.jsx";
import FavoritesPage from "./features/favorites/pages/FavoritesPage.jsx";
import ShoppingListPage from "./features/shopping-list/pages/ShoppingListPage.jsx";
import SettingsPage from "./features/settings/pages/SettingsPage.jsx";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Geprüft wird das Auth-Objekt, das main.jsx über den Router-Context reinreicht
// (siehe main.jsx: context={{ auth }}). isLoaded === false heißt "Clerk hat noch
// nicht geladen, wissen wir noch nicht" -- dann noch nicht umleiten.
function requireAuth({ context, location }) {
  const auth = context.auth;
  if (auth?.isLoaded && !auth.isSignedIn) {
    throw redirect({ to: "/login", search: { redirect: location.href } });
  }
}

const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  beforeLoad: requireAuth,
  component: RecipesPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracking",
  beforeLoad: requireAuth,
  component: TrackingPage,
});

const workoutsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workouts",
  beforeLoad: requireAuth,
  component: WorkoutsPage,
});

// Neu: nur verlinkt aus der Sidebar auf RecipesPage.jsx, noch ohne echtes
// Backend-Feature -- siehe Kommentare in den jeweiligen Page-Dateien.
const nutritionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nutrition",
  beforeLoad: requireAuth,
  component: NutritionPage,
});

const mealPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meal-planner",
  beforeLoad: requireAuth,
  component: MealPlannerPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  beforeLoad: requireAuth,
  component: ProgressPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  beforeLoad: requireAuth,
  component: FavoritesPage,
});

const shoppingListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shopping-list",
  beforeLoad: requireAuth,
  component: ShoppingListPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  beforeLoad: requireAuth,
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  recipesRoute,
  trackingRoute,
  workoutsRoute,
  nutritionRoute,
  mealPlannerRoute,
  progressRoute,
  favoritesRoute,
  shoppingListRoute,
  settingsRoute,
]);

export const router = createRouter({
  routeTree,
  context: { auth: undefined },
});
