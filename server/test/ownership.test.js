import test from "node:test";
import assert from "node:assert/strict";
import SavedRecipe from "../features/recipes/recipe.model.js";
import { deleteSavedRecipe } from "../features/recipes/recipes.service.js";

test("Rezept-Löschung filtert gleichzeitig nach Dokument und Eigentümer", async () => {
  const original = SavedRecipe.findOneAndDelete;
  let receivedFilter;
  SavedRecipe.findOneAndDelete = (filter) => {
    receivedFilter = filter;
    return Promise.resolve(null);
  };

  try {
    await deleteSavedRecipe("owner-id", "recipe-id");
    assert.deepEqual(receivedFilter, { _id: "recipe-id", user: "owner-id" });
  } finally {
    SavedRecipe.findOneAndDelete = original;
  }
});
