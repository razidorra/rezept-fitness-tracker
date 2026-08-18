# API-Spezifikation – FitMeal Backend

Implementierter REST-Vertrag des Backends. Client-Verhalten und Routen stehen in [`../client/spec.md`](../client/spec.md).

## Basis

- lokale Base-URL: `http://localhost:5000/api`
- Request/Response: JSON, außer `204 No Content`
- Datumswerte: `YYYY-MM-DD` oder gültiger ISO-8601-Timestamp
- Fehlerformat:

```json
{ "error": "Beschreibung des Fehlers" }
```

- unbekannte Route: `404 { "error": "Endpunkt nicht gefunden" }`
- ungültiger JSON-Objekt-Body: `400`
- nicht behandelter Serverfehler: `500`

## Authentifizierung

Geschützte Endpunkte erwarten:

```http
Authorization: Bearer <Clerk session JWT>
```

`clerkMiddleware()` verifiziert das JWT. `requireAuth` setzt `req.userId` aus der authentifizierten Clerk-Sitzung. Fehlende oder ungültige Authentifizierung ergibt `401`.

---

## Health

### `GET /api/health` – öffentlich

Mit MongoDB-Verbindung:

```json
{ "status": "ok", "database": "connected" }
```

- `200`: Datenbank verbunden
- `503`: Server erreichbar, Datenbank nicht verbunden

---

## Catalog – öffentlich

Die Katalog-Routen normalisieren externe Anbieter in stabile interne Objekte.

### `GET /api/catalog/foods?query=<2..100 Zeichen>`

Open Food Facts mit USDA-Fallback.

```json
[
  {
    "id": "123",
    "name": "Greek Yogurt",
    "brand": "Example",
    "imageUrl": "https://...",
    "nutritionGrade": "a",
    "per": "100 g",
    "calories": 120,
    "protein": 9,
    "carbs": 5,
    "fat": 6,
    "sourceUrl": "https://...",
    "source": "Open Food Facts"
  }
]
```

- `400`: Query fehlt, ist kürzer als zwei oder länger als 100 Zeichen
- `502`: beide externen Quellen nicht erreichbar

### `GET /api/catalog/meals?query=<optional, max. 100 Zeichen>`

TheMealDB-Suche; ohne Query werden mehrere zufällige, deduplizierte Gerichte geladen.

```json
[
  {
    "id": "52772",
    "name": "Teriyaki Chicken Casserole",
    "imageUrl": "https://...",
    "category": "Chicken",
    "area": "Japanese",
    "instructions": "...",
    "sourceUrl": "https://...",
    "ingredients": [{ "name": "soy sauce", "measure": "3/4 cup" }],
    "source": "TheMealDB"
  }
]
```

- `400`: Query länger als 100 Zeichen
- `502`: TheMealDB nicht erreichbar

TheMealDB liefert keine verifizierten Makronährwerte; der Server erfindet deshalb keine.

### `GET /api/catalog/exercises?query=<2..100 Zeichen>` – Legacy

Liest englische wger-Übungsübersetzungen, filtert serverseitig und liefert maximal zwölf Ergebnisse.

```json
[{ "id": "1", "name": "Squat", "description": "...", "sourceUrl": "https://...", "source": "wger" }]
```

Der Endpunkt bleibt kompatibel, wird von der aktuellen Nutrition-Oberfläche aber nicht verlinkt.

---

## Recipes – geschützt

Alle Routen unter `/api/recipes` benötigen Clerk-Auth.

### `GET /api/recipes/search?query=<1..100 Zeichen>` – Legacy

Ruft Spoonacular `complexSearch` mit Nutrition-Daten auf.

```json
[{ "externalId": "123", "title": "Pasta", "imageUrl": "https://...", "calories": 650, "protein": 30, "carbs": 70, "fat": 20 }]
```

- `400`: Query fehlt/zu lang
- `401`: nicht angemeldet
- `502`: Key fehlt/ungültig, Rate-Limit oder Spoonacular-Ausfall

Die aktuelle UI nutzt für Online-Rezepte primär `/api/catalog/meals`.

### `POST /api/recipes`

```json
{
  "externalId": "static:protein-oatmeal",
  "title": "Protein Oatmeal",
  "imageUrl": "https://...",
  "calories": 420,
  "protein": 28,
  "carbs": 52,
  "fat": 11
}
```

- Pflicht: `externalId` (max. 100), `title` (max. 200)
- optional: `imageUrl` (max. 2000), nichtnegative Nutrition-Zahlen
- `201`: gespeichertes `SavedRecipe`
- `400`: Validierung
- `409`: dasselbe externe Rezept für denselben Nutzer bereits vorhanden

### `GET /api/recipes`

Liefert die gespeicherten Rezepte des aktuellen Nutzers, neueste zuerst.

### `DELETE /api/recipes/:id`

- `204`: gelöscht
- `400`: ungültige ObjectId
- `404`: nicht vorhanden oder gehört einem anderen Nutzer

---

## Tracking – geschützt

### `GET /api/tracking?from=YYYY-MM-DD&to=YYYY-MM-DD`

Liefert persönliche Einträge, optional inklusive Start- und Endtag gefiltert.

- beide Filter sind unabhängig optional
- `400`: ungültiges Datum oder `from > to`

### `POST /api/tracking`

```json
{
  "customTitle": "Breakfast: Protein Oatmeal",
  "calories": 420,
  "protein": 28,
  "carbs": 52,
  "fat": 11,
  "loggedDate": "2026-08-18"
}
```

Alternativ kann `recipe` eine gültige `SavedRecipe`-ObjectId enthalten.

| Feld | Regel |
|---|---|
| `recipe` | optional, gültige ObjectId |
| `customTitle` | erforderlich, wenn `recipe` fehlt; max. 200 Zeichen |
| `calories` | erforderlich, endliche nichtnegative Zahl |
| `protein`, `carbs`, `fat` | optional, endliche nichtnegative Zahlen |
| `loggedDate` | optional, gültiges ISO-Datum; Default im Modell |

- `201`: erstelltes `TrackingEntry`
- `400`: ungültige Daten

### `DELETE /api/tracking/:id`

- `204`: gelöscht
- `400`: ungültige ObjectId
- `404`: nicht vorhanden oder fremder Eintrag

---

## Workouts – geschützt, Legacy

Die Routen bleiben aus Kompatibilitätsgründen implementiert, werden in der aktuellen Nutrition-UI jedoch nicht geroutet.

### `GET /api/workouts`

Liefert nur Workouts des aktuellen Nutzers.

### `POST /api/workouts`

```json
{
  "name": "Full Body",
  "duration": 45,
  "date": "2026-08-18",
  "exercises": [{ "name": "Squat", "sets": 3, "reps": 10, "weight": 40 }]
}
```

- `name`: Pflicht, max. 200 Zeichen
- `duration`: optional, nichtnegative Zahl
- `date`: optional, gültiges ISO-Datum
- `exercises`: optional, maximal 50 Elemente
- Übung: `name` Pflicht (max. 120), `sets`/`reps`/`weight` optional und nichtnegativ
- `201`: erstelltes Workout
- `400`: ungültige Daten

### `DELETE /api/workouts/:id`

- `204`: gelöscht
- `400`: ungültige ObjectId
- `404`: nicht vorhanden oder fremdes Workout

---

## Datenmodelle und Ownership

- `SavedRecipe`: eindeutige Kombination aus `user` und `externalId`
- `TrackingEntry`: optionaler Verweis auf `SavedRecipe`
- `Workout`: eingebettete Exercises ohne eigene IDs
- alle drei Modelle speichern Clerk `userId` als String im Feld `user`
- Service-Lese- und Löschoperationen filtern immer nach `user`

## Statuscodes

| Code | Bedeutung |
|---:|---|
| `200` | erfolgreiche Abfrage |
| `201` | Ressource erstellt |
| `204` | erfolgreich gelöscht, kein Body |
| `400` | Eingabe ungültig |
| `401` | nicht authentifiziert |
| `404` | Route oder eigene Ressource nicht gefunden |
| `409` | Duplikat |
| `500` | interner Fehler |
| `502` | externe Datenquelle fehlgeschlagen |
| `503` | Datenbank nicht bereit |
