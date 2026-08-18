import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import { findMeals } from "../../catalog/api/catalogApi.js";
import { addIngredients } from "../../shopping-list/shoppingListStorage.js";
import DailyPlanBuilder from "../components/DailyPlanBuilder.jsx";

export default function MealPlannerPage() {
  const { isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const [query, setQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadMeals(search = "") {
    setLoading(true);
    setError("");
    try {
      setMeals(await findMeals(search));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isSignedIn) return undefined;
    let ignore = false;
    findMeals()
      .then((results) => { if (!ignore) setMeals(results); })
      .catch((requestError) => { if (!ignore) setError(requestError.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [isSignedIn]);

  function submit(event) {
    event.preventDefault();
    loadMeals(query.trim());
  }

  function addMeal(meal) {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    addIngredients(userId, meal.ingredients);
    setMessage(`${meal.name}: ingredients added to your shopping list.`);
  }

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Meal Planner</h1>
      <p className="text-text">Calculate your target, choose meals from simple dropdowns and send them directly to Tracking.</p>
      <DailyPlanBuilder isSignedIn={isSignedIn} userId={userId} openSignIn={openSignIn} />

      {isSignedIn && <>
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-xl!">Search for more ideas online</h2>
        <p className="text-sm text-text">Online recipes do not provide verified calories. Use them as inspiration and add their ingredients to your shopping list; they are not automatically sent to Tracking.</p>
      </section>
      <form onSubmit={submit} className="mt-6 flex max-w-xl flex-wrap gap-2">
        <label htmlFor="meal-search" className="sr-only">Search meals</label>
        <input id="meal-search" maxLength="100" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by meal name" className="min-w-56 flex-1 rounded-md border border-border bg-surface px-3 py-2" />
        <button disabled={loading} className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-60">Search</button>
        <button type="button" disabled={loading} onClick={() => { setQuery(""); loadMeals(); }} className="rounded-pill border border-border px-5 py-2 font-semibold">Surprise me</button>
      </form>
      {message && <p role="status" className="mt-4 rounded-md border border-accent-border bg-accent-bg p-3 text-sm">{message}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      {loading ? <p className="mt-6">Loading meal ideas…</p> : meals.length === 0 ? <p className="mt-6">No matching meals found.</p> : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => <article key={meal.id} className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            {meal.imageUrl && <img src={meal.imageUrl} alt={meal.name} className="aspect-video w-full object-cover" loading="lazy" />}
            <div className="p-5"><p className="text-xs font-semibold uppercase tracking-wide text-accent">{meal.category}{meal.area ? ` · ${meal.area}` : ""}</p><h2 className="mt-1 text-lg!">{meal.name}</h2><ul className="mt-3 max-h-32 overflow-auto text-sm">{meal.ingredients.map((ingredient) => <li key={`${ingredient.name}-${ingredient.measure}`}>{ingredient.measure} {ingredient.name}</li>)}</ul><button type="button" onClick={() => addMeal(meal)} className="mt-4 rounded-pill bg-accent px-4 py-2 text-sm font-semibold text-accent-ink">Add ingredients</button></div>
          </article>)}
        </div>
      )}
      <p className="mt-5 text-xs text-text">Recipes and images: TheMealDB. Free access is intended for development and educational projects.</p>
      </>}
    </AppShell>
  );
}
