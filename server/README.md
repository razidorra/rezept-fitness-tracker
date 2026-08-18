# FitMeal API

Express-/MongoDB-Backend für die nutrition-orientierte FitMeal-Anwendung. Clerk verwaltet Benutzerkonten und Sitzungen. Der Code ist feature-basiert aufgebaut:

```text
Route → Controller/Validierung → Service → Mongoose-Modell oder externe API
```

## Tech-Stack

- Node.js mit ES Modules
- Express 5
- MongoDB und Mongoose
- Clerk Express Middleware
- Node Test Runner

## Einrichtung

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

| Variable | Erforderlich | Zweck |
|---|---:|---|
| `MONGODB_URI` | ja | MongoDB-Verbindung |
| `CLERK_PUBLISHABLE_KEY` | ja | Publishable Key derselben Clerk-App wie im Client |
| `CLERK_SECRET_KEY` | ja | geheimer Backend-Key |
| `CLIENT_ORIGIN` | nein | erlaubte Frontend-Origin(s), kommasepariert; Default `http://localhost:5173` |
| `PORT` | nein | Server-Port; Default `5000` |
| `USDA_API_KEY` | nein | höheres USDA-Limit; sonst offizieller `DEMO_KEY` als Fallback |
| `SPOONACULAR_API_KEY` | nur Legacy-Suche | `/api/recipes/search`; die aktuelle UI verwendet TheMealDB |

Der Server akzeptiert aus Kompatibilitätsgründen auch `VITE_CLERK_PUBLISHABLE_KEY`, falls `CLERK_PUBLISHABLE_KEY` nicht gesetzt ist. `CLERK_SECRET_KEY` darf niemals in den Client oder ins Repository gelangen.

## Startverhalten und Health

Der HTTP-Server startet erst nach erfolgreicher MongoDB-Verbindung. `GET /api/health` dient als Readiness-Check und liefert bei fehlender DB-Verbindung `503`.

## Authentifizierung

Der Client sendet ein Clerk-Session-JWT als `Authorization: Bearer <token>`. `clerkMiddleware()` verifiziert es; `requireAuth` übernimmt anschließend die Clerk-User-ID als `req.userId`.

Es gibt keine lokale Passwort- oder User-Collection. Persönliche MongoDB-Dokumente enthalten die Clerk-User-ID im Feld `user`. Lesen und Löschen werden immer zusätzlich nach dieser ID gefiltert.

## Endpunkte

Öffentlich:

- `GET /api/health`
- `GET /api/catalog/foods?query=` – Open Food Facts, USDA-Fallback
- `GET /api/catalog/meals?query=` – TheMealDB; ohne Query zufällige Vorschläge
- `GET /api/catalog/exercises?query=` – wger, als Legacy-Katalog noch verfügbar

Mit Clerk-Auth:

- `GET /api/recipes/search?query=` – Spoonacular-Legacy-Suche
- `GET/POST /api/recipes`, `DELETE /api/recipes/:id`
- `GET/POST /api/tracking`, `DELETE /api/tracking/:id`
- `GET/POST /api/workouts`, `DELETE /api/workouts/:id` – Legacy-API, nicht mehr in der sichtbaren Nutrition-UI

Details und Payloads stehen in [spec.md](spec.md).

## Externe Datenquellen

- Open Food Facts: Produktdaten und Nährwerte pro 100 g; 15-Minuten-Cache
- USDA FoodData Central: Fallback bei Open-Food-Facts-Ausfall
- TheMealDB: Rezeptinspiration und Zutaten
- Spoonacular: nur alter geschützter Suchendpunkt
- wger: alter Übungskatalog mit einer Stunde Cache

Externe Fehler werden als `502` mit `{ "error": "..." }` normalisiert. TheMealDB-Key `1` und USDA-`DEMO_KEY` sind für Entwicklung stark begrenzt; Nutzungsbedingungen und produktive API-Keys müssen vor einem kommerziellen Release geprüft werden.

## Sicherheit

- CORS ist auf `CLIENT_ORIGIN` beschränkt.
- JSON-Bodies sind auf 100 KB begrenzt.
- POST-/PUT-/PATCH-Bodies müssen JSON-Objekte sein.
- IDs, Datumswerte, Strings und nichtnegative Zahlen werden vor Service-Aufrufen validiert.
- Secret Keys gehören ausschließlich in `server/.env`.

## Tests

```bash
npm test
```

Die Tests prüfen Health/404/Fehlerformat, Validierung, Authentifizierung, Besitzerfilterung und Katalog-Normalisierung.
