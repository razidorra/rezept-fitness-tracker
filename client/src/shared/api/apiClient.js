// Zentraler fetch-Wrapper: Basis-URL, JSON-Handling, Auth-Header, Fehler-Behandlung.
// Wird von den feature-eigenen api/-Dateien genutzt (z.B. features/auth/api/authApi.js),
// nicht direkt aus Komponenten heraus aufrufen.
//
// Beispiel-Nutzung in einer Feature-api-Datei:
//   import { apiRequest } from "../../../shared/api/apiClient.js";
//   export function login(email, password) {
//     return apiRequest("/auth/login", { method: "POST", body: { email, password } });
//   }
//   export function getSavedRecipes() {
//     return apiRequest("/recipes", { auth: true }); // hängt automatisch den Token an
//   }

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (z.B. DELETE) hat keinen JSON-Body
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error || `Request fehlgeschlagen (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}
