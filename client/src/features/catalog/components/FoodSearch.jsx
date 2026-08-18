import { useState } from "react";
import { searchFoods } from "../api/catalogApi.js";

export default function FoodSearch({ onSelect, actionLabel = "Use values" }) {
  const [query, setQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError("");
    try {
      setFoods(await searchFoods(query.trim()));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg!">Food database</h2>
          <p className="text-sm text-text">Nutrition per 100 g from Open Food Facts.</p>
        </div>
        <form onSubmit={submit} className="flex w-full gap-2 sm:w-auto">
          <label className="sr-only" htmlFor="food-search">Search food</label>
          <input id="food-search" minLength="2" maxLength="100" required value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. Greek yogurt" className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 sm:w-64" />
          <button disabled={loading} className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-60">{loading ? "Searching…" : "Search"}</button>
        </form>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {!loading && foods.length === 0 && query && !error && <p className="mt-4 text-sm">No products found yet. Try a brand or a more specific name.</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {foods.map((food) => (
          <article key={food.id} className="flex gap-3 rounded-md border border-border bg-bg p-3">
            {food.imageUrl ? <img src={food.imageUrl} alt="" className="h-20 w-16 rounded object-contain" loading="lazy" /> : <div className="h-20 w-16 rounded bg-surface" />}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm!" title={food.name}>{food.name}</h3>
              <p className="truncate text-xs">{food.brand || "Unknown brand"} · {food.per}</p>
              <p className="mt-1 text-xs">{food.calories ?? "—"} kcal · P {food.protein ?? "—"}g · C {food.carbs ?? "—"}g · F {food.fat ?? "—"}g</p>
              <p className="mt-1 text-[11px] text-text">{food.source}</p>
              {food.sourceUrl && <a href={food.sourceUrl} target="_blank" rel="noreferrer" className="mr-3 mt-2 inline-flex text-xs font-semibold text-accent">Open source ↗</a>}
              <button type="button" onClick={() => onSelect(food)} className="mt-2 text-xs font-semibold text-accent">{actionLabel}</button>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-4 text-xs text-text">Data: Open Food Facts (ODbL), with USDA FoodData Central (CC0) as fallback. Values can be incomplete; verify the product label.</p>
    </section>
  );
}
