// Steuert eingehende HTTP-Requests fürs Recipes-Feature.
// Validiert Input, ruft recipes.service.js auf, formt die Response.

import * as recipesService from "./recipes.service.js";
import {
  hasValidOptionalNumbers,
  isNonEmptyString,
  isValidObjectId,
} from "../../utils/validation.js";

export async function search(req, res) {
  try {
    const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
    if (!query || query.length > 100) {
      return res.status(400).json({ error: "query muss 1 bis 100 Zeichen lang sein" });
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
    if (!isNonEmptyString(externalId, 100) || !isNonEmptyString(title, 200)) {
      return res.status(400).json({ error: "externalId und title sind erforderlich" });
    }
    if (!hasValidOptionalNumbers(req.body, ["calories", "protein", "carbs", "fat"])) {
      return res.status(400).json({ error: "Nährwerte müssen nichtnegative Zahlen sein" });
    }
    if (imageUrl !== undefined && (typeof imageUrl !== "string" || imageUrl.length > 2000)) {
      return res.status(400).json({ error: "imageUrl ist ungültig" });
    }

    const recipe = await recipesService.saveRecipeForUser(req.userId, {
      externalId: externalId.trim(),
      title: title.trim(),
      imageUrl,
      calories,
      protein,
      carbs,
      fat,
    });
    res.status(201).json(recipe);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Rezept ist bereits gespeichert" });
    }
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
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Ungültige Rezept-ID" });
    }
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
