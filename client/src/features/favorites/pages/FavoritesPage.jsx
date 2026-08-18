// Gespeicherte Rezepte des eingeloggten Nutzers, dauerhaft aus MongoDB geladen.

import { useEffect, useState } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import { deleteRecipe, getSavedRecipes } from "../../recipes/api/recipesApi.js";

export default function FavoritesPage() {
  const { isSignedIn } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) return;
    getSavedRecipes().then(setRecipes).catch((err) => setError(err.message));
  }, [isSignedIn]);

  async function remove(id) {
    try {
      await deleteRecipe(id);
      setRecipes((current) => current.filter((recipe) => recipe._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Favorites</h1>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {!isSignedIn ? (
        <div className="mt-5 rounded-lg border border-accent-border bg-accent-bg p-5">
          <h2 className="text-lg!">Your favorites live here</h2>
          <p className="mb-4 text-sm">Sign in to view and manage your saved recipes.</p>
          <SignInButton mode="modal"><button type="button" className="rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-accent-ink">Log in</button></SignInButton>
        </div>
      ) : recipes.length === 0 ? <p className="mt-5">No saved recipes yet.</p> : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <article key={recipe._id} className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
              {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="aspect-video w-full object-cover" />}
              <div className="p-4">
                <h2 className="text-lg!">{recipe.title}</h2>
                <p className="text-sm">{recipe.calories ?? "—"} kcal · {recipe.protein ?? "—"}g protein</p>
                <button type="button" onClick={() => remove(recipe._id)} className="mt-3 text-sm font-medium text-red-600">Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
