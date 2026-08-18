import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import StatCard from "../../../shared/components/StatCard.jsx";
import LandingPage from "../components/LandingPage.jsx";
import { getEntries } from "../../tracking/api/trackingApi.js";

// Stat-Kacheln unten sind erstmal feste Platzhalterwerte. Sobald das
// Tracking-Backend steht, ersetzt du die durch echte Werte aus trackingApi.js
// (GET /api/tracking) -- Rest vom Dashboard (Diagramm und Rezeptkarten)
// baust du selbst nach demselben Muster.
//
// SignedOut zeigt die Marketing-Landingpage, SignedIn das Dashboard. Header
// und Footer kommen für beide Zustände zentral aus App.jsx.

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    if (!isSignedIn) return;
    const today = new Date().toISOString().slice(0, 10);
    getEntries({ from: today, to: today }).then((entries) => {
      setTotals(entries.reduce((sum, entry) => ({
        calories: sum.calories + (entry.calories ?? 0),
        protein: sum.protein + (entry.protein ?? 0),
        carbs: sum.carbs + (entry.carbs ?? 0),
        fat: sum.fat + (entry.fat ?? 0),
      }), { calories: 0, protein: 0, carbs: 0, fat: 0 }));
    }).catch(() => {});
  }, [isSignedIn]);

  return (
    <>
      <SignedOut><LandingPage /></SignedOut>
      <SignedIn><>
        <AppShell>
          <section id="dashboard" className="scroll-mt-24">
          <h1 className="mb-1! text-2xl! sm:text-3xl!">Dashboard</h1>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Calories" value={totals.calories} unit="kcal" />
            <StatCard label="Protein" value={totals.protein} unit="g" />
            <StatCard label="Carbs" value={totals.carbs} unit="g" />
            <StatCard label="Fat" value={totals.fat} unit="g" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/recipes"
              className="rounded-lg border border-border bg-surface p-6 shadow-sm hover:border-accent-border"
            >
              <h2 className="mb-1! text-lg!">Browse Recipes</h2>
              <p className="text-sm text-text">Find and save new recipes.</p>
            </Link>
            <Link
              to="/tracking"
              className="rounded-lg border border-border bg-surface p-6 shadow-sm hover:border-accent-border"
            >
              <h2 className="mb-1! text-lg!">Add Entry</h2>
              <p className="text-sm text-text">
                Log a meal or value for today.
              </p>
            </Link>
            <Link
              to="/meal-planner"
              className="rounded-lg border border-border bg-surface p-6 shadow-sm hover:border-accent-border"
            >
              <h2 className="mb-1! text-lg!">Plan Your Meals</h2>
              <p className="text-sm text-text">Build a balanced plan for today.</p>
            </Link>
          </div>
          </section>
        </AppShell>
        <div className="mt-20 border-t border-border pt-16">
          <LandingPage authenticated />
        </div>
      </></SignedIn>
    </>
  );
}
