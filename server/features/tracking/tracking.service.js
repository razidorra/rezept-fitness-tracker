// Business-Logik fürs Tracking-Feature: Einträge (Mahlzeiten/Werte) für einen User
// anlegen, lesen (z.B. pro Tag) und löschen.
// Wird von tracking.controller.js aufgerufen.

import TrackingEntry from "./tracking.model.js";
import SavedRecipe from "../recipes/recipe.model.js";

export async function createEntryForUser(userId, entryData) {
  if (entryData.recipe) {
    const recipe = await SavedRecipe.exists({ _id: entryData.recipe, user: userId });
    if (!recipe) {
      const error = new Error("Rezept nicht gefunden");
      error.status = 400;
      throw error;
    }
  }
  return TrackingEntry.create({ ...entryData, user: userId });
}

export function getEntriesForUser(userId, { from, to }) {
  const filter = { user: userId };
  if (from || to) {
    filter.loggedDate = {};
    if (from) filter.loggedDate.$gte = new Date(`${from}T00:00:00.000Z`);
    if (to) filter.loggedDate.$lte = new Date(`${to}T23:59:59.999Z`);
  }
  return TrackingEntry.find(filter).sort({ loggedDate: -1 });
}

export function deleteEntry(userId, entryId) {
  return TrackingEntry.findOneAndDelete({ _id: entryId, user: userId });
}
