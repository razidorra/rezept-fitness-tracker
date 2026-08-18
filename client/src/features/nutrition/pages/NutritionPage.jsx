import { useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import FoodSearch from "../../catalog/components/FoodSearch.jsx";
import { createEntry } from "../../tracking/api/trackingApi.js";

const today = new Date().toISOString().slice(0, 10);

export default function NutritionPage() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function track(food) {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setMessage("");
    setError("");
    try {
      await createEntry({
        customTitle: `${food.name} (100 g)`,
        calories: food.calories ?? 0,
        protein: food.protein ?? undefined,
        carbs: food.carbs ?? undefined,
        fat: food.fat ?? undefined,
        loggedDate: today,
      });
      setMessage(`${food.name} was added to today's tracking.`);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Nutrition</h1>
      <p className="text-text">Look up packaged foods and transfer their macros directly to your daily log.</p>
      {!isSignedIn && <div className="mt-4 rounded-lg border border-accent-border bg-accent-bg p-4 text-sm">Search is available as a preview. Sign in when you add a product to your tracking.</div>}
      {message && <p role="status" className="mt-4 rounded-md border border-accent-border bg-accent-bg p-3 text-sm">{message}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
      <FoodSearch onSelect={track} actionLabel="Track 100 g" />
    </AppShell>
  );
}
