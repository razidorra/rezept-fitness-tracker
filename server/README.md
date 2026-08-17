# Server – Rezept-Fitness-Tracker (Backend)

Backend-API für den Rezept-Fitness-Tracker. Node.js + Express + MongoDB (Mongoose).
Aufgabe: Nutzer verwalten, Rezepte speichern und Ernährungs-/Fitness-Werte (Kalorien, Protein, Carbs, Fat) tracken.

## Tech-Stack

- **Node.js / Express 5** – HTTP-Server & Routing
- **MongoDB Atlas / Mongoose** – Datenbank & Schemas
- **bcrypt** – Passwort-Hashing
- **jsonwebtoken (JWT)** – Authentifizierung
- **dotenv** – Umgebungsvariablen aus `.env`
- **cors** – Cross-Origin-Requests vom Client (Vite-Dev-Server) erlauben
- **nodemon** – Auto-Neustart im Dev-Modus

> Hinweis: `pg` (PostgreSQL-Treiber) steht zwar in `package.json`, wird aber aktuell nicht verwendet – die App nutzt ausschließlich MongoDB/Mongoose.

Das Projekt nutzt durchgängig **ES6-Module** (`import`/`export`, ES2015+ Syntax), erkennbar an `"type": "module"` in `package.json`. Kein `require`/`module.exports` (CommonJS) mehr.

## Ordnerstruktur (feature-basiert)

Statt nach Dateityp (`models/`, `routes/`, `controllers/`) ist der Code nach **Fachlichkeit** gruppiert: alles, was zu `auth`, `recipes` bzw. `tracking` gehört, liegt zusammen in einem Ordner. Das hält zusammengehörigen Code beieinander und macht es leichter, ein Feature komplett zu überblicken oder zu erweitern.

```
server/
├── index.js                       # Einstiegspunkt: Express-App, Middleware, Routen einhängen, Server-Start
├── config/
│   └── db.js                       # Verbindung zu MongoDB (connectDB)
├── middleware/
│   └── requireAuth.js              # schützt Routen: prüft JWT, hängt User an req (TODO: Logik)
├── features/
│   ├── auth/
│   │   ├── user.model.js            # Mongoose-Schema: Nutzer (email, passwordHash)
│   │   ├── auth.routes.js           # HTTP-Routen: /api/auth/...
│   │   ├── auth.controller.js       # nimmt Requests entgegen, ruft Service auf
│   │   └── auth.service.js          # Business-Logik: Passwort hashen, JWT erzeugen, ...
│   ├── recipes/
│   │   ├── recipe.model.js          # Mongoose-Schema: gespeicherte Rezepte
│   │   ├── recipes.routes.js        # HTTP-Routen: /api/recipes/...
│   │   ├── recipes.controller.js
│   │   └── recipes.service.js       # z.B. Spoonacular-API abfragen, Rezepte speichern
│   └── tracking/
│       ├── tracking.model.js        # Mongoose-Schema: geloggte Mahlzeiten/Werte
│       ├── tracking.routes.js       # HTTP-Routen: /api/tracking/...
│       ├── tracking.controller.js
│       └── tracking.service.js
├── .env                            # lokale Umgebungsvariablen (NICHT committen)
└── package.json
```

Jedes Feature folgt demselben 3-Schichten-Muster:
**routes** (welche URL/Methode gibt es) → **controller** (Request/Response, Input-Validierung) → **service** (eigentliche Business-Logik, DB-Zugriffe über das Model).

Aktuell sind `auth.controller.js`, `recipes.controller.js`, `tracking.controller.js` etc. noch leere Grundgerüste (`export default {}` mit `TODO`-Kommentaren) — die Routen-Dateien exportieren einen leeren Express-Router. Das Backend startet damit sauber und ist vorbereitet, wird aber erst mit echter Logik nutzbar.

## Wie der Server startet (`index.js`)

1. `dotenv` lädt die Variablen aus `.env` in `process.env`.
2. `connectDB()` (aus `config/db.js`) baut die Verbindung zu MongoDB Atlas über `MONGODB_URI` auf. Schlägt das fehl, wird der Fehler geloggt und der Prozess beendet (`process.exit(1)`), da die App ohne DB nicht sinnvoll läuft.
3. Express-Middleware wird registriert:
   - `cors()` – erlaubt Requests vom Frontend (andere Origin/Port)
   - `express.json()` – parst JSON-Bodies aus Requests
4. `GET /api/health` als einfacher Verfügbarkeits-Check.
5. Die drei Feature-Router werden eingehängt: `/api/auth`, `/api/recipes`, `/api/tracking` (aktuell noch ohne konkrete Endpunkte, siehe oben).
6. Der Server hört auf `PORT` (Default: `5000`).

## Datenmodelle

- **User** (`features/auth/user.model.js`): `email` (unique), `passwordHash`. Klartext-Passwörter werden nie gespeichert, nur der bcrypt-Hash.
- **SavedRecipe** (`features/recipes/recipe.model.js`): gehört zu einem `User` (`user`-Referenz), speichert ein extern gefundenes Rezept (`externalId`, `title`, `imageUrl`, Nährwerte).
- **TrackingEntry** (`features/tracking/tracking.model.js`): gehört zu einem `User`, optional verknüpft mit einem `SavedRecipe` oder mit freiem `customTitle`, plus Nährwerte und `loggedDate` (Datum des Eintrags).

Alle drei Schemas nutzen `{ timestamps: true }`, also automatische `createdAt`/`updatedAt`-Felder. Der Mongoose-Modellname (z.B. `mongoose.model("User", ...)`) bleibt unabhängig vom Dateinamen bestehen, damit `ref: "User"` in anderen Schemas weiter funktioniert.

## Setup & lokales Starten

1. Abhängigkeiten installieren:
   ```bash
   cd server
   npm install
   ```
2. `.env`-Datei mit echten Werten anlegen/befüllen (siehe unten) – **niemals committen**, sie steht in `.gitignore`.
3. Server im Dev-Modus starten (Auto-Reload bei Codeänderungen):
   ```bash
   npm run dev
   ```
4. Prüfen, ob alles läuft:
   ```bash
   curl http://localhost:5000/api/health
   # -> {"status":"ok"}
   ```

## Umgebungsvariablen (`.env`)

| Variable | Bedeutung |
|---|---|
| `MONGODB_URI` | Connection-String zum MongoDB-Atlas-Cluster inkl. Nutzername/Passwort |
| `JWT_SECRET` | Geheimer Schlüssel zum Signieren/Verifizieren von JWTs (Login-Tokens) |
| `SPOONACULAR_API_KEY` | API-Key für die [Spoonacular API](https://spoonacular.com/food-api) (Rezeptsuche) |
| `PORT` | Port, auf dem der Server lauscht (Default `5000`) |

`MONGODB_URI` und `JWT_SECRET` müssen echte Werte haben – die MongoDB-Zugangsdaten findest du in Atlas unter *Database Access*, das JWT-Secret kannst du dir lokal generieren, z. B.:
```bash
node -e "import('crypto').then(c => console.log(c.randomBytes(48).toString('hex')))"
```

## API-Endpunkte

| Methode | Pfad | Beschreibung | Status |
|---|---|---|---|
| GET | `/api/health` | Health-Check, gibt `{status:"ok"}` zurück | ✅ vorhanden |
| POST | `/api/auth/register` | Neuen Nutzer anlegen (`{email, password}` → `{token, user}`) | ✅ vorhanden |
| POST | `/api/auth/login` | Login (`{email, password}` → `{token, user}`) | ✅ vorhanden |
| GET | `/api/recipes/search?query=` | Rezepte extern suchen (Spoonacular) | ✅ vorhanden |
| GET | `/api/recipes` | Gespeicherte Rezepte des Nutzers auflisten | ✅ vorhanden |
| POST | `/api/recipes` | Rezept speichern | ✅ vorhanden |
| DELETE | `/api/recipes/:id` | Gespeichertes Rezept löschen | ✅ vorhanden |
| GET/POST | `/api/tracking` | Tracking-Einträge lesen / anlegen | 🚧 geplant |

Alle `/api/recipes`-Endpunkte sind über `requireAuth` geschützt (Details siehe [spec.md](spec.md)).

`register`/`login` geben bei Erfolg ein JWT zurück (7 Tage gültig). Das Token muss der Client bei geschützten Requests als `Authorization: Bearer <token>`-Header mitschicken – geprüft wird das serverseitig über `middleware/requireAuth.js` (ebenfalls implementiert, wird aber noch von keiner Route genutzt, da `/api/recipes` und `/api/tracking` noch nicht existieren).

Fehlerfälle: `400` bei fehlenden Feldern oder zu kurzem Passwort (< 8 Zeichen), `409` bei bereits registrierter E-Mail, `401` bei falschen Login-Daten.
