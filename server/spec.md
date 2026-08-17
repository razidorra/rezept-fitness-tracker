# API-Spezifikation – Rezept-Fitness-Tracker Backend

Formale Beschreibung aller API-Endpunkte: Request/Response-Format, Statuscodes, Auth-Anforderungen. Für den allgemeinen Projektüberblick siehe [README.md](README.md).

**Legende:** ✅ implementiert · 🚧 spezifiziert, noch nicht implementiert

## Basis

- Base-URL (lokal): `http://localhost:5000/api`
- Format: JSON (`Content-Type: application/json`) für Request- und Response-Bodies
- Datumswerte: ISO 8601 (`YYYY-MM-DD` oder vollständiger Timestamp)
- Fehler-Format (einheitlich für alle Endpunkte):
  ```json
  { "error": "Beschreibung des Fehlers" }
  ```

## Authentifizierung

- JWT (JSON Web Token), ausgestellt von `POST /api/auth/register` und `POST /api/auth/login`
- Gültigkeit: 7 Tage
- Geschützte Endpunkte erwarten den Token im Header:
  ```
  Authorization: Bearer <token>
  ```
- Geprüft wird das über `middleware/requireAuth.js`. Bei fehlendem/ungültigem Token: `401 { "error": "..." }`. Die `userId` aus dem Token steht Handlern danach als `req.userId` zur Verfügung.

---

## Health

### `GET /api/health` ✅
Verfügbarkeits-Check, kein Auth nötig.

**Response `200`**
```json
{ "status": "ok" }
```

---

## Auth (`/api/auth`)

### `POST /api/auth/register` ✅
Legt einen neuen Nutzer an.

**Request Body**
```json
{ "email": "user@example.com", "password": "mindestens8Zeichen" }
```

| Feld | Typ | Pflicht | Regel |
|---|---|---|---|
| `email` | string | ja | muss eindeutig sein (unique in DB) |
| `password` | string | ja | mind. 8 Zeichen |

**Response `201`**
```json
{ "token": "<jwt>", "user": { "id": "...", "email": "user@example.com" } }
```

**Fehler:** `400` (Feld fehlt / Passwort zu kurz) · `409` (E-Mail bereits registriert) · `500`

### `POST /api/auth/login` ✅
Meldet einen bestehenden Nutzer an.

**Request Body**
```json
{ "email": "user@example.com", "password": "mindestens8Zeichen" }
```

**Response `200`**
```json
{ "token": "<jwt>", "user": { "id": "...", "email": "user@example.com" } }
```

**Fehler:** `400` (Feld fehlt) · `401` (E-Mail oder Passwort falsch) · `500`

---

## Recipes (`/api/recipes`) ✅

Alle Endpunkte erfordern Auth (`Authorization: Bearer <token>`).

### `GET /api/recipes/search?query=<string>` ✅
Fragt die externe [Spoonacular API](https://spoonacular.com/food-api) ab (nutzt `SPOONACULAR_API_KEY`), speichert nichts.

**Response `200`**
```json
[
  { "externalId": "12345", "title": "Pasta Bolognese", "imageUrl": "...", "calories": 650, "protein": 30, "carbs": 70, "fat": 20 }
]
```

**Fehler:** `400` (kein `query`) · `401` (kein/ungültiger Token) · `502` (Spoonacular nicht erreichbar/Limit erschöpft)

### `POST /api/recipes` ✅
Speichert ein Rezept (z.B. aus den Suchergebnissen) für den eingeloggten Nutzer.

**Request Body**
```json
{ "externalId": "12345", "title": "Pasta Bolognese", "imageUrl": "...", "calories": 650, "protein": 30, "carbs": 70, "fat": 20 }
```

| Feld | Typ | Pflicht |
|---|---|---|
| `externalId` | string | ja |
| `title` | string | ja |
| `imageUrl` | string | nein |
| `calories`, `protein`, `carbs`, `fat` | number | nein |

**Response `201`**: das gespeicherte `SavedRecipe`-Dokument (inkl. `_id`, `user`, Zeitstempel).

**Fehler:** `400` (Pflichtfeld fehlt) · `401`

### `GET /api/recipes` ✅
Liste aller gespeicherten Rezepte des eingeloggten Nutzers.

**Response `200`**: Array von `SavedRecipe`-Dokumenten.

### `DELETE /api/recipes/:id` ✅
Löscht ein gespeichertes Rezept (muss dem eingeloggten Nutzer gehören).

**Response `204`** (kein Body)
**Fehler:** `401` · `404` (nicht gefunden oder gehört nicht dem Nutzer)

---

## Tracking (`/api/tracking`) 🚧

Alle Endpunkte erfordern Auth.

### `GET /api/tracking?from=YYYY-MM-DD&to=YYYY-MM-DD` 🚧
Liste der Tracking-Einträge des eingeloggten Nutzers, optional gefiltert nach Zeitraum (`from`/`to` optional; ohne Angabe: alle Einträge).

**Response `200`**: Array von `TrackingEntry`-Dokumenten.

### `POST /api/tracking` 🚧
Legt einen neuen Tracking-Eintrag an (geloggte Mahlzeit/Werte für einen Tag).

**Request Body**
```json
{ "recipe": "<SavedRecipe-Id>", "customTitle": "Frühstück", "calories": 450, "protein": 20, "carbs": 50, "fat": 15, "loggedDate": "2026-08-17" }
```

| Feld | Typ | Pflicht | Hinweis |
|---|---|---|---|
| `recipe` | ObjectId | nein | Referenz auf ein `SavedRecipe`; wenn nicht gesetzt, wird `customTitle` erwartet |
| `customTitle` | string | nein | freier Titel, falls kein `recipe` verknüpft ist |
| `calories` | number | ja | |
| `protein`, `carbs`, `fat` | number | nein | |
| `loggedDate` | date | nein | Default: aktueller Zeitpunkt |

**Response `201`**: das erstellte `TrackingEntry`-Dokument.

**Fehler:** `400` (`calories` fehlt) · `401`

### `DELETE /api/tracking/:id` 🚧
Löscht einen Tracking-Eintrag (muss dem eingeloggten Nutzer gehören).

**Response `204`**
**Fehler:** `401` · `404`

---

## Datenmodelle

Siehe [README.md](README.md#datenmodelle) für die Mongoose-Schemas (`User`, `SavedRecipe`, `TrackingEntry`) mit Feldtypen und Beziehungen.
