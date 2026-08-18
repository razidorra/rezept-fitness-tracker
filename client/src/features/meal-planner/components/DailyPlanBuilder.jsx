import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { createEntry, getEntries } from "../../tracking/api/trackingApi.js";
import { estimateTargets, loadPlannerProfile, savePlannerProfile } from "../mealPlanStorage.js";

const MEAL_SLOTS = [
  {
    id: "breakfast", label: "Breakfast", share: 0.25,
    meals: [
      { id: "protein-oatmeal", title: "Protein Oatmeal", kcal: 420, protein: 28, carbs: 52, fat: 11 },
      { id: "avocado-toast", title: "Avocado Toast", kcal: 320, protein: 12, carbs: 36, fat: 15 },
      { id: "berry-smoothie", title: "Berry Protein Smoothie", kcal: 280, protein: 25, carbs: 36, fat: 5 },
      { id: "yogurt-parfait", title: "Berry Yogurt Parfait", kcal: 290, protein: 19, carbs: 40, fat: 8 },
    ],
  },
  {
    id: "lunch", label: "Lunch", share: 0.35,
    meals: [
      { id: "chicken-bowl", title: "Grilled Chicken Quinoa Bowl", kcal: 550, protein: 52, carbs: 48, fat: 16 },
      { id: "chickpea-salad", title: "Chickpea Avocado Salad", kcal: 350, protein: 15, carbs: 44, fat: 15 },
      { id: "veggie-stir-fry", title: "Veggie Stir Fry", kcal: 420, protein: 22, carbs: 58, fat: 12 },
    ],
  },
  {
    id: "dinner", label: "Dinner", share: 0.30,
    meals: [
      { id: "salmon", title: "Lemon Garlic Salmon", kcal: 580, protein: 45, carbs: 18, fat: 34 },
      { id: "veggie-stir-fry", title: "Veggie Stir Fry", kcal: 420, protein: 22, carbs: 58, fat: 12 },
      { id: "chicken-bowl", title: "Grilled Chicken Quinoa Bowl", kcal: 550, protein: 52, carbs: 48, fat: 16 },
    ],
  },
];

const defaultProfile = { weight: "", height: "", age: "", sex: "", activity: "", goal: "" };
const today = new Date().toISOString().slice(0, 10);

export default function DailyPlanBuilder({ isSignedIn, userId, openSignIn }) {
  const [profile, setProfile] = useState(() => loadPlannerProfile(userId) || defaultProfile);
  const [configured, setConfigured] = useState(() => Boolean(loadPlannerProfile(userId)));
  const [selected, setSelected] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [trackedCalories, setTrackedCalories] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [saving, setSaving] = useState(false);
  const targets = configured ? estimateTargets(profile) : null;

  useEffect(() => {
    if (!isSignedIn) return;
    getEntries({ from: today, to: today })
      .then((entries) => setTrackedCalories(entries.reduce((sum, entry) => sum + Number(entry.calories || 0), 0)))
      .catch(() => setTrackedCalories(0));
  }, [isSignedIn]);

  const selectedMeals = useMemo(() => MEAL_SLOTS.flatMap((slot) => {
    const meal = slot.meals.find((option) => option.id === selected[slot.id]);
    return meal ? [{ ...meal, slot: slot.label }] : [];
  }), [selected]);
  const selectedCalories = selectedMeals.reduce((sum, meal) => sum + meal.kcal, 0);

  function updateProfile(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function calculate(event) {
    event.preventDefault();
    if (!isSignedIn) {
      setFeedback({ type: "warning", text: "Log in to calculate and save your personal daily target." });
      openSignIn();
      return;
    }
    savePlannerProfile(userId, profile);
    setConfigured(true);
    setFeedback({ type: "success", text: "Your estimated daily target is ready. Now choose meals from the dropdowns." });
  }

  async function sendToTracking() {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!targets) {
      setFeedback({ type: "warning", text: "Calculate your daily target first." });
      return;
    }
    if (selectedMeals.length === 0) {
      setFeedback({ type: "warning", text: "Choose at least one meal." });
      return;
    }
    const projectedCalories = trackedCalories + selectedCalories;
    if (projectedCalories > targets.calories) {
      setFeedback({ type: "warning", text: `These choices would put today about ${Math.round(projectedCalories - targets.calories)} kcal above your estimated target. Choose a lighter option or remove an existing tracking entry.` });
      return;
    }

    setSaving(true);
    try {
      await Promise.all(selectedMeals.map((meal) => createEntry({
        customTitle: `${meal.slot}: ${meal.title}`,
        calories: meal.kcal,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        loggedDate: today,
      })));
      setTrackedCalories(projectedCalories);
      setSelected({ breakfast: "", lunch: "", dinner: "" });
      setFeedback({ type: "success", text: `${selectedMeals.length} meal${selectedMeals.length === 1 ? "" : "s"} added to today's tracking.` });
    } catch (error) {
      setFeedback({ type: "warning", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-6 rounded-lg border border-border bg-surface p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">Simple daily planner</p>
      <h2 className="mt-1 text-xl!">Calculate, choose and track</h2>

      <form onSubmit={calculate} className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <ProfileInput label="Weight (kg)" type="number" min="35" max="300" step="0.1" value={profile.weight} onChange={(value) => updateProfile("weight", value)} />
        <ProfileInput label="Height (cm)" type="number" min="120" max="230" value={profile.height} onChange={(value) => updateProfile("height", value)} />
        <ProfileInput label="Age (18+)" type="number" min="18" max="100" value={profile.age} onChange={(value) => updateProfile("age", value)} />
        <SelectInput label="Equation setting" value={profile.sex} onChange={(value) => updateProfile("sex", value)} options={[["female", "Female"], ["male", "Male"]]} />
        <SelectInput label="Daily activity" value={profile.activity} onChange={(value) => updateProfile("activity", value)} options={[["sedentary", "Mostly sitting"], ["light", "Light movement"], ["moderate", "Active several days"], ["active", "Very active"]]} />
        <SelectInput label="Goal" value={profile.goal} onChange={(value) => updateProfile("goal", value)} options={[["lose", "Lose weight slowly"], ["maintain", "Maintain weight"], ["gain", "Gain weight slowly"]]} />
        <button className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink sm:col-span-2 lg:col-span-3">Calculate my daily target</button>
      </form>

      <p className="mt-3 text-xs text-text">Adult estimate only—not medical advice. Individual needs can differ.</p>

      {feedback && <p role={feedback.type === "warning" ? "alert" : "status"} className={`mt-5 rounded-md border p-3 text-sm ${feedback.type === "warning" ? "border-amber-400 bg-amber-50 text-amber-900" : "border-accent-border bg-accent-bg text-text-h"}`}>{feedback.text}</p>}

      {targets && (
        <div className="mt-7">
          <div className="grid gap-3 sm:grid-cols-3">
            <Summary label="Daily target" value={`${targets.calories} kcal`} />
            <Summary label="Already tracked" value={`${Math.round(trackedCalories)} kcal`} />
            <Summary label="Still available" value={`${Math.max(0, targets.calories - Math.round(trackedCalories))} kcal`} />
          </div>

          <h3 className="mt-7 mb-1! text-lg!">Choose meals</h3>
          <p className="text-sm text-text">Each dropdown shows meals with calculated nutrition values.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {MEAL_SLOTS.map((slot) => {
              const allowance = Math.round(targets.calories * slot.share);
              const meal = slot.meals.find((option) => option.id === selected[slot.id]);
              const difference = meal ? allowance - meal.kcal : allowance;
              return (
                <label key={slot.id} className="rounded-md border border-border bg-bg p-4 text-sm font-medium text-text-h">
                  {slot.label}
                  <span className="ml-2 text-xs font-normal text-text">about {allowance} kcal</span>
                  <select value={selected[slot.id]} onChange={(event) => setSelected((current) => ({ ...current, [slot.id]: event.target.value }))} className="mt-2 w-full rounded-md border border-border bg-surface px-3 py-2.5">
                    <option value="">Choose a meal…</option>
                    {slot.meals.map((option) => <option key={option.id} value={option.id}>{option.title} — {option.kcal} kcal</option>)}
                  </select>
                  {meal && <span className={`mt-2 block text-xs ${difference < 0 ? "text-amber-600" : "text-accent"}`}>{difference >= 0 ? `${difference} kcal remain in this meal guide` : `${Math.abs(difference)} kcal above this meal guide`}</span>}
                </label>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="button" onClick={sendToTracking} disabled={saving} className="rounded-pill bg-accent px-6 py-2.5 font-semibold text-accent-ink disabled:opacity-60">{saving ? "Adding…" : "Add selected meals to Tracking"}</button>
            <p className="text-sm text-text">Selected: {selectedCalories} kcal</p>
            <Link to="/tracking" className="text-sm font-semibold text-accent">Open Tracking →</Link>
          </div>
        </div>
      )}
    </section>
  );
}

function ProfileInput({ label, onChange, ...props }) {
  return <label className="text-sm font-medium text-text-h">{label}<input required onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" {...props} /></label>;
}

function SelectInput({ label, value, onChange, options }) {
  return <label className="text-sm font-medium text-text-h">{label}<select required value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2"><option value="" disabled>Select…</option>{options.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select></label>;
}

function Summary({ label, value }) {
  return <div className="rounded-md border border-border bg-bg p-4"><p className="text-xs text-text">{label}</p><p className="mt-1 text-lg font-semibold text-text-h">{value}</p></div>;
}
