import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import AppShell from "../../../shared/components/AppShell.jsx";
import { createEntry, deleteEntry, getEntries } from "../api/trackingApi.js";
import FoodSearch from "../../catalog/components/FoodSearch.jsx";
import { estimateTargets, loadPlannerProfile } from "../../meal-planner/mealPlanStorage.js";

const today = new Date().toISOString().slice(0, 10);
const MEAL_GUIDES = [
  { id: "breakfast", label: "Breakfast", share: 0.25 },
  { id: "lunch", label: "Lunch", share: 0.35 },
  { id: "dinner", label: "Dinner", share: 0.30 },
  { id: "snacks", label: "Snacks & drinks", share: 0.10 },
];

export default function TrackingPage() {
  const { isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ customTitle: "", calories: "", protein: "", carbs: "", fat: "", loggedDate: today });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const plannerProfile = loadPlannerProfile(userId);
  const targets = plannerProfile ? estimateTargets(plannerProfile) : null;
  const todayEntries = entries.filter((entry) => new Date(entry.loggedDate).toISOString().slice(0, 10) === today);
  const totalToday = todayEntries.reduce((sum, entry) => sum + Number(entry.calories || 0), 0);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getEntries().then(setEntries).catch((err) => setError(err.message));
  }, [isSignedIn]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function useFood(food) {
    setForm((current) => ({
      ...current,
      customTitle: food.name,
      calories: food.calories ?? "",
      protein: food.protein ?? "",
      carbs: food.carbs ?? "",
      fat: food.fat ?? "",
    }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const optionalNumber = (value) => (value === "" ? undefined : Number(value));
      const created = await createEntry({ customTitle: form.customTitle, calories: Number(form.calories), protein: optionalNumber(form.protein), carbs: optionalNumber(form.carbs), fat: optionalNumber(form.fat), loggedDate: form.loggedDate });
      setEntries((current) => [created, ...current]);
      setForm((current) => ({ ...current, customTitle: "", calories: "", protein: "", carbs: "", fat: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    try {
      await deleteEntry(id);
      setEntries((current) => current.filter((entry) => entry._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Tracking</h1>
      <p className="text-text">Log meals and track your daily calories and macros.</p>
      {!isSignedIn && <div className="mt-4 rounded-lg border border-accent-border bg-accent-bg p-4 text-sm text-text-h">Preview the tracker below. Sign in when you submit your first meal.</div>}
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      {isSignedIn && (targets ? (
        <section className="mt-6 rounded-lg border border-accent-border bg-accent-bg p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-accent">Today's calorie guide</p><h2 className="mt-1 text-xl!">{Math.round(totalToday)} of {targets.calories} kcal tracked</h2></div>
            <p className="font-semibold text-text-h">{Math.max(0, Math.round(targets.calories - totalToday))} kcal remaining</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {MEAL_GUIDES.map((guide) => {
              const allowance = Math.round(targets.calories * guide.share);
              const used = todayEntries.filter((entry) => entry.customTitle?.toLowerCase().startsWith(`${guide.id}:`)).reduce((sum, entry) => sum + Number(entry.calories || 0), 0);
              return <div key={guide.id} className="rounded-md border border-accent-border bg-surface p-3"><p className="text-sm font-semibold text-text-h">{guide.label}</p><p className="mt-1 text-xs text-text">Suggested: {allowance} kcal</p><p className="mt-1 text-xs font-semibold text-accent">{Math.max(0, allowance - used)} kcal left</p></div>;
            })}
          </div>
          <p className="mt-4 text-xs text-text">This is a simple distribution of your estimated daily target, not a strict rule.</p>
        </section>
      ) : (
        <div className="mt-5 rounded-md border border-border bg-surface p-4 text-sm">Want a breakfast and dinner calorie guide? <Link to="/meal-planner" className="font-semibold text-accent">Calculate it in Meal Planner →</Link></div>
      ))}
      <FoodSearch onSelect={useFood} actionLabel="Fill tracker" />
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-3 lg:grid-cols-6">
        <label className="text-sm font-medium text-text-h sm:col-span-2">Meal<input required maxLength="200" value={form.customTitle} onChange={(event) => update("customTitle", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" placeholder="Breakfast" /></label>
        {["calories", "protein", "carbs", "fat"].map((field) => <label key={field} className="text-sm font-medium capitalize text-text-h">{field}<input required={field === "calories"} min="0" step="0.1" type="number" value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>)}
        <label className="text-sm font-medium text-text-h sm:col-span-2">Date<input required type="date" value={form.loggedDate} onChange={(event) => update("loggedDate", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>
        <button type={isSignedIn ? "submit" : "button"} onClick={isSignedIn ? undefined : openSignIn} disabled={submitting} className="self-end rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-60 sm:col-span-2">{submitting ? "Saving…" : "Add entry"}</button>
      </form>
      <div className="mt-6 space-y-3">
        {entries.length === 0 ? <p>No entries yet.</p> : entries.map((entry) => <article key={entry._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4"><div><h2 className="text-base!">{entry.customTitle || "Saved recipe"}</h2><p className="text-sm">{new Date(entry.loggedDate).toLocaleDateString()} · {entry.calories} kcal · {entry.protein ?? 0}g protein · {entry.carbs ?? 0}g carbs · {entry.fat ?? 0}g fat</p></div><button type="button" onClick={() => remove(entry._id)} className="text-sm font-medium text-red-600">Delete</button></article>)}
      </div>
    </AppShell>
  );
}
