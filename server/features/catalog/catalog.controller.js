import * as catalogService from "./catalog.service.js";

function readQuery(req, { optional = false } = {}) {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
  if ((!optional && query.length < 2) || query.length > 100) return null;
  return query;
}

async function respond(res, action, message) {
  try {
    res.json(await action());
  } catch (error) {
    console.error(`${message}:`, error.message);
    res.status(error.status || 500).json({ error: message });
  }
}

export function foods(req, res) {
  const query = readQuery(req);
  if (query === null) return res.status(400).json({ error: "query muss 2 bis 100 Zeichen lang sein" });
  return respond(res, () => catalogService.searchFoods(query), "Lebensmittelsuche fehlgeschlagen");
}

export function exercises(req, res) {
  const query = readQuery(req);
  if (query === null) return res.status(400).json({ error: "query muss 2 bis 100 Zeichen lang sein" });
  return respond(res, () => catalogService.searchExercises(query), "Übungssuche fehlgeschlagen");
}

export function meals(req, res) {
  const query = readQuery(req, { optional: true });
  if (query === null) return res.status(400).json({ error: "query darf höchstens 100 Zeichen lang sein" });
  return respond(res, () => catalogService.findMeals(query), "Rezeptvorschläge konnten nicht geladen werden");
}
