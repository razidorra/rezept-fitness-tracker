// API-Aufrufe fürs Tracking-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Siehe server/spec.md, Abschnitt "Tracking", für das Datenformat.

import { apiRequest } from "../../../shared/api/apiClient.js";

export function getEntries({ from, to } = {}) {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const suffix = query.size ? `?${query}` : "";
  return apiRequest(`/tracking${suffix}`, { auth: true });
}

export function createEntry(entryData) {
  return apiRequest("/tracking", { method: "POST", auth: true, body: entryData });
}

export function deleteEntry(id) {
  return apiRequest(`/tracking/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}
