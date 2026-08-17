// API-Aufrufe fürs Auth-Feature. Nutzt apiRequest() aus shared/api/apiClient.js,
// wird von LoginPage.jsx / RegisterPage.jsx aufgerufen (nicht fetch() direkt in
// der Komponente).
//
// Siehe server/spec.md, Abschnitt "Auth" für Request/Response-Format.

// TODO: login(email, password) -> apiRequest("/auth/login", { method: "POST", body: {...} })
// TODO: register(email, password) -> apiRequest("/auth/register", { method: "POST", body: {...} })
//
// Beide geben laut Spec { token, user } zurück -- überleg dir, wo/wie der Token
// gespeichert wird (siehe getToken() in apiClient.js: aktuell liest der aus
// localStorage -- also müsste login/register den Token dort auch reinschreiben).
