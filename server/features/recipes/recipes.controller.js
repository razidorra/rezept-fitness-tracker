// Steuert eingehende HTTP-Requests fürs Recipes-Feature.
// Validiert Input, ruft recipes.service.js auf, formt die Response.

import * as recipesService from "./recipes.service.js";

export async function search(req, res) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "query ist erforderlich" });
    }

    const results = await recipesService.searchExternalRecipes(query);
    res.json(results);
  } catch (err) {
    console.error("Recipes-Search-Fehler:", err.message);
    res.status(err.status || 500).json({ error: "Rezeptsuche fehlgeschlagen" });
  }
}

export async function save(req, res) {
  try {
    const { externalId, title, imageUrl, calories, protein, carbs, fat } = req.body;
    if (!externalId || !title) {
      return res.status(400).json({ error: "externalId und title sind erforderlich" });
    }

    const recipe = await recipesService.saveRecipeForUser(req.userId, {
      externalId,
      title,
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
    });
    res.status(201).json(recipe);
  } catch (err) {
    console.error("Recipes-Save-Fehler:", err.message);
    res.status(500).json({ error: "Rezept konnte nicht gespeichert werden" });
  }
}

export async function list(req, res) {
  try {
    const recipes = await recipesService.getSavedRecipesForUser(req.userId);
    res.json(recipes);
  } catch (err) {
    console.error("Recipes-List-Fehler:", err.message);
    res.status(500).json({ error: "Rezepte konnten nicht geladen werden" });
  }
}

export async function remove(req, res) {
  try {
    const deleted = await recipesService.deleteSavedRecipe(req.userId, req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Rezept nicht gefunden" });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Recipes-Delete-Fehler:", err.message);
    res.status(500).json({ error: "Rezept konnte nicht gelöscht werden" });
  }
}
