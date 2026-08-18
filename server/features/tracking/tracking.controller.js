// Steuert eingehende HTTP-Requests fürs Tracking-Feature.
// Validiert Input, ruft tracking.service.js auf, formt die Response.

import * as trackingService from "./tracking.service.js";
import {
  hasValidOptionalNumbers,
  isNonEmptyString,
  isNonNegativeNumber,
  isValidDate,
  isValidDateOnly,
  isValidObjectId,
} from "../../utils/validation.js";

export async function create(req, res) {
  try {
    const { recipe, customTitle, calories, protein, carbs, fat, loggedDate } = req.body;
    if (!isNonNegativeNumber(calories)) {
      return res.status(400).json({ error: "calories muss eine nichtnegative Zahl sein" });
    }
    if (!recipe && !isNonEmptyString(customTitle, 200)) {
      return res.status(400).json({ error: "recipe oder customTitle ist erforderlich" });
    }
    if (recipe && !isValidObjectId(recipe)) {
      return res.status(400).json({ error: "Ungültige Rezept-ID" });
    }
    if (!hasValidOptionalNumbers(req.body, ["protein", "carbs", "fat"]) || !isValidDate(loggedDate)) {
      return res.status(400).json({ error: "Nährwerte oder Datum sind ungültig" });
    }

    const entry = await trackingService.createEntryForUser(req.userId, {
      recipe,
      customTitle: customTitle?.trim(),
      calories,
      protein,
      carbs,
      fat,
      loggedDate,
    });
    res.status(201).json(entry);
  } catch (err) {
    console.error("Tracking-Create-Fehler:", err.message);
    res.status(err.status || 500).json({ error: err.status ? err.message : "Eintrag konnte nicht erstellt werden" });
  }
}

export async function list(req, res) {
  try {
    const { from, to } = req.query;
    if (!isValidDateOnly(from) || !isValidDateOnly(to) || (from && to && from > to)) {
      return res.status(400).json({ error: "Ungültiger Zeitraum" });
    }
    const entries = await trackingService.getEntriesForUser(req.userId, { from, to });
    res.json(entries);
  } catch (err) {
    console.error("Tracking-List-Fehler:", err.message);
    res.status(500).json({ error: "Einträge konnten nicht geladen werden" });
  }
}

export async function remove(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Ungültige Eintrag-ID" });
    }
    const deleted = await trackingService.deleteEntry(req.userId, req.params.id);
    if (!deleted) return res.status(404).json({ error: "Eintrag nicht gefunden" });
    res.status(204).send();
  } catch (err) {
    console.error("Tracking-Delete-Fehler:", err.message);
    res.status(500).json({ error: "Eintrag konnte nicht gelöscht werden" });
  }
}
