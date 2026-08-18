import { useEffect, useMemo, useState } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import StatCard from "../../../shared/components/StatCard.jsx";
import { getEntries } from "../../tracking/api/trackingApi.js";

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

export default function ProgressPage() {
  const { isSignedIn } = useAuth();
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState("");
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return dateOnly(date);
  }), []);

  useEffect(() => {
    if (!isSignedIn) return;
    getEntries({ from: days[0], to: days[6] })
      .then(setEntries)
      .catch((requestError) => setError(requestError.message));
  }, [days, isSignedIn]);

  const caloriesByDay = days.map((day) => entries
    .filter((entry) => String(entry.loggedDate).slice(0, 10) === day)
    .reduce((sum, entry) => sum + (entry.calories || 0), 0));
  const maxCalories = Math.max(...caloriesByDay, 1);
  const totals = entries.reduce((sum, entry) => ({
    calories: sum.calories + (entry.calories || 0),
    protein: sum.protein + (entry.protein || 0),
    carbs: sum.carbs + (entry.carbs || 0),
    fat: sum.fat + (entry.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  const loggedDays = caloriesByDay.filter((calories) => calories > 0).length;

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Progress</h1>
      <p className="text-text">A seven-day overview calculated from your nutrition entries.</p>
      {!isSignedIn ? <div className="mt-5 max-w-lg rounded-lg border border-accent-border bg-accent-bg p-5"><h2 className="text-lg!">Your progress is private</h2><p className="mb-4 text-sm">Sign in to see your nutrition trends.</p><SignInButton mode="modal"><button className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink">Log in</button></SignInButton></div> : <>
        {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"><StatCard label="7-day calories" value={Math.round(totals.calories)} unit="kcal" /><StatCard label="Protein" value={Math.round(totals.protein)} unit="g" /><StatCard label="Carbs" value={Math.round(totals.carbs)} unit="g" /><StatCard label="Fat" value={Math.round(totals.fat)} unit="g" /><StatCard label="Days logged" value={loggedDays} unit="/ 7" /></div>
        <section className="mt-6 rounded-lg border border-border bg-surface p-5"><h2 className="text-lg!">Daily calories</h2><div className="mt-5 flex h-56 items-end gap-2" aria-label="Calories over the last seven days">{days.map((day, index) => <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-medium">{Math.round(caloriesByDay[index])}</span><div className="w-full max-w-12 rounded-t bg-accent" style={{ height: `${Math.max((caloriesByDay[index] / maxCalories) * 160, caloriesByDay[index] ? 8 : 2)}px` }} /><span className="text-xs text-text">{new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: "short" })}</span></div>)}</div></section>
      </>}
    </AppShell>
  );
}
