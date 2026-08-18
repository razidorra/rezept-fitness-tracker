// Zentraler fetch-Wrapper: Basis-URL, JSON-Handling, Auth-Header, Fehler-Behandlung.
// Wird von den feature-eigenen api/-Dateien genutzt,
// nicht direkt aus Komponenten heraus aufrufen.
//
// Beispiel-Nutzung in einer Feature-api-Datei:
//   export function getSavedRecipes() {
//     return apiRequest("/recipes", { auth: true }); // hängt den Clerk-Token an
//   }

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let getAuthToken = async () => null;

export function configureAuthTokenProvider(provider) {
  getAuthToken = provider;
}

export async function apiRequest(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const finalHeaders = { "Content-Type": "application/json", ...headers };
  const requestBody = body ? JSON.stringify(body) : undefined;

  if (auth) {
    const token = await getAuthToken({ skipCache: false });
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    } else {
      const error = new Error("Nicht angemeldet");
      error.status = 401;
      throw error;
    }
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: requestBody,
  });

  // Clerk-Tokens sind kurzlebig. Falls ein gecachter Token gerade abgelaufen
  // ist, einmal frisch bei Clerk holen und denselben Request wiederholen.
  if (auth && response.status === 401) {
    const refreshedToken = await getAuthToken({ skipCache: true });
    if (refreshedToken) {
      finalHeaders.Authorization = `Bearer ${refreshedToken}`;
      response = await fetch(`${BASE_URL}${path}`, { method, headers: finalHeaders, body: requestBody });
    }
  }

  // 204 No Content (z.B. DELETE) hat keinen JSON-Body
  const data = response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message = response.status === 401
      ? "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an."
      : data?.error || `Request fehlgeschlagen (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}
