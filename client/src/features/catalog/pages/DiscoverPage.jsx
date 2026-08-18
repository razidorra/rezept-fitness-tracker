import { useState } from "react";
import AppShell from "../../../shared/components/AppShell.jsx";
import { findMeals, searchFoods } from "../api/catalogApi.js";

const TYPES = [
  { key: "all", label: "All" },
  { key: "recipes", label: "Healthy recipes" },
  { key: "nutrition", label: "Nutrition" },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState({ recipes: [], nutrition: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value.length < 2) return;
    setLoading(true);
    setError("");
    setSearched(true);

    const requests = {
      recipes: type === "all" || type === "recipes" ? findMeals(value) : Promise.resolve([]),
      nutrition: type === "all" || type === "nutrition" ? searchFoods(value) : Promise.resolve([]),
    };
    const keys = Object.keys(requests);
    const settled = await Promise.allSettled(Object.values(requests));
    const next = { recipes: [], nutrition: [] };
    const failures = [];
    settled.forEach((result, index) => {
      if (result.status === "fulfilled") next[keys[index]] = result.value;
      else failures.push(result.reason?.message || keys[index]);
    });
    setResults(next);
    if (failures.length) setError(`Some sources could not be loaded: ${failures.join(", ")}`);
    setLoading(false);
  }

  const total = results.recipes.length + results.nutrition.length;

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Online Search</h1>
      <p className="max-w-2xl text-text">Find relevant healthy recipes and reliable nutrition data from public food databases.</p>
      <form onSubmit={submit} className="mt-6 rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap gap-2">{TYPES.map((item) => <button key={item.key} type="button" onClick={() => setType(item.key)} className={`rounded-pill border px-4 py-2 text-sm font-medium ${type === item.key ? "border-accent bg-accent text-accent-ink" : "border-border bg-bg"}`}>{item.label}</button>)}</div>
        <div className="mt-4 flex max-w-2xl gap-2"><label htmlFor="online-search" className="sr-only">Search online</label><input id="online-search" required minLength="2" maxLength="100" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={type === "nutrition" ? "e.g. oats or Greek yogurt" : "e.g. salmon, avocado or lentils"} className="min-w-0 flex-1 rounded-md border border-border bg-bg px-4 py-2.5" /><button disabled={loading} className="rounded-pill bg-accent px-6 py-2.5 font-semibold text-accent-ink disabled:opacity-60">{loading ? "Searching…" : "Search online"}</button></div>
      </form>
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      {!searched && <div className="mt-6 rounded-lg border border-accent-border bg-accent-bg p-5 text-sm">Try “salmon” for recipes or “oats” and “Greek yogurt” for nutrition.</div>}
      {searched && !loading && total === 0 && <p className="mt-6">No matching online results. Try a shorter English search term.</p>}
      {results.recipes.length > 0 && <ResultSection title="Recipes" source="TheMealDB"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{results.recipes.map((meal) => <a key={meal.id} href={meal.sourceUrl || `https://www.themealdb.com/meal/${meal.id}`} target="_blank" rel="noreferrer" className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm hover:border-accent-border">{meal.imageUrl && <img src={meal.imageUrl} alt={meal.name} className="aspect-video w-full object-cover" loading="lazy" />}<div className="p-4"><h3 className="text-base!">{meal.name}</h3><p className="text-sm">{meal.category}{meal.area ? ` · ${meal.area}` : ""}</p><span className="mt-3 inline-flex text-xs font-semibold text-accent">Open recipe ↗</span></div></a>)}</div></ResultSection>}
      {results.nutrition.length > 0 && <ResultSection title="Food & nutrition" source="Open Food Facts / USDA"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{results.nutrition.map((food) => <a key={food.id} href={food.sourceUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-border bg-surface p-4 hover:border-accent-border"><h3 className="text-sm!">{food.name}</h3><p className="mt-1 text-xs">{food.brand || food.source} · per 100 g</p><p className="mt-2 text-sm">{food.calories ?? "—"} kcal · P {food.protein ?? "—"}g · C {food.carbs ?? "—"}g · F {food.fat ?? "—"}g</p><span className="mt-3 inline-flex text-xs font-semibold text-accent">Open nutrition page ↗</span></a>)}</div></ResultSection>}
    </AppShell>
  );
}

function ResultSection({ title, source, children }) {
  return <section className="mt-8"><div className="mb-3 flex items-end justify-between gap-3"><h2 className="text-xl!">{title}</h2><p className="text-xs text-text">Source: {source}</p></div>{children}</section>;
}
