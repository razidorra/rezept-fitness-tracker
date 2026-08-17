import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";
import StatCard from "../../../shared/components/StatCard.jsx";
import LandingPage from "../components/LandingPage.jsx";

// Stat-Kacheln unten sind erstmal feste Platzhalterwerte. Sobald das
// Tracking-Backend steht, ersetzt du die durch echte Werte aus trackingApi.js
// (GET /api/tracking) -- Rest vom Dashboard (Diagramm, Rezept-/Workout-Karten)
// baust du selbst nach demselben Muster.

export default function HomePage() {
  return (
    <>
      <SignedOut>
        <LandingPage />
      </SignedOut>

      <SignedIn>
        <div className="flex flex-col gap-4">
          <h1>Dashboard</h1>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Calories" value={1890} unit="kcal" />
            <StatCard label="Protein" value={120} unit="g" />
            <StatCard label="Carbs" value={200} unit="g" />
            <StatCard label="Fat" value={60} unit="g" />
          </div>
          {/* TODO: Kalorien-Diagramm + Rezept-/Workout-Karten hier ergänzen,
              sobald du so weit bist -- siehe Link-Karten in LandingPage.jsx als
              Stil-Referenz. */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              to="/workouts"
              className="rounded-lg border border-border bg-surface p-6 shadow-sm hover:border-accent-border"
            >
              <h2 className="mb-1! text-lg!">Plan a Workout</h2>
              <p className="text-sm text-text">Put together a new workout.</p>
            </Link>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
