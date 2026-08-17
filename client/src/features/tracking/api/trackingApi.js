// API-Aufrufe fürs Tracking-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Setzt voraus, dass /api/tracking im Backend existiert (siehe server/spec.md,
// Abschnitt "Tracking") -- also erst backend-seitig fertig bauen, bevor das hier
// sinnvoll testbar ist.

// TODO: getEntries({ from, to }) -> apiRequest(`/tracking?from=${from}&to=${to}`, { auth: true })
// TODO: createEntry(entryData) -> apiRequest("/tracking", { method: "POST", auth: true, body: entryData })
// TODO: deleteEntry(id) -> apiRequest(`/tracking/${id}`, { method: "DELETE", auth: true })
