import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import App from "./App.jsx";
import HomePage from "./features/dashboard/pages/HomePage.jsx";
import LoginPage from "./features/auth/pages/LoginPage.jsx";
import RegisterPage from "./features/auth/pages/RegisterPage.jsx";
import RecipesPage from "./features/recipes/pages/RecipesPage.jsx";
import TrackingPage from "./features/tracking/pages/TrackingPage.jsx";
import NutritionPage from "./features/nutrition/pages/NutritionPage.jsx";
import MealPlannerPage from "./features/meal-planner/pages/MealPlannerPage.jsx";
import ProgressPage from "./features/progress/pages/ProgressPage.jsx";
import FavoritesPage from "./features/favorites/pages/FavoritesPage.jsx";
import ShoppingListPage from "./features/shopping-list/pages/ShoppingListPage.jsx";
import SettingsPage from "./features/settings/pages/SettingsPage.jsx";
import DiscoverPage from "./features/catalog/pages/DiscoverPage.jsx";
import ProfilePage from "./features/profile/pages/ProfilePage.jsx";

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

const recipesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recipes",
  component: RecipesPage,
});

const discoverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discover",
  beforeLoad: ({ context }) => {
    if (!context.auth?.isSignedIn) throw redirect({ to: "/login" });
  },
  component: DiscoverPage,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tracking",
  component: TrackingPage,
});

// Alle Fachseiten sind als öffentliche Vorschau sichtbar. Persönliche Aktionen
// öffnen bei Gästen Clerk; die API selbst bleibt serverseitig geschützt.
const nutritionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nutrition",
  component: NutritionPage,
});

const mealPlannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meal-planner",
  component: MealPlannerPage,
});

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/progress",
  component: ProgressPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/favorites",
  component: FavoritesPage,
});

const shoppingListRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shopping-list",
  component: ShoppingListPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  recipesRoute,
  discoverRoute,
  trackingRoute,
  nutritionRoute,
  mealPlannerRoute,
  progressRoute,
  favoritesRoute,
  shoppingListRoute,
  settingsRoute,
  profileRoute,
]);

export const router = createRouter({
  routeTree,
  context: { auth: undefined },
});
