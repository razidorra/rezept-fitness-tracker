# FitMeal Client

React-/Vite-Frontend für FitMeal, eine Nutrition-App zum Entdecken gesunder Rezepte, Planen von Mahlzeiten und Tracken von Kalorien und Makronährstoffen.

## Tech-Stack

- React 19 und Vite 8
- TanStack Router
- Tailwind CSS 4 mit zentralen Design-Tokens
- Clerk für Registrierung, Login, Profil und Sitzungen
- REST-Kommunikation mit dem Express-Backend

## Funktionen

- öffentliche Marketing-Startseite und Dashboard für eingeloggte Nutzer
- lokaler Rezeptkatalog mit Zutaten, Zubereitung und Nährwerten
- öffentliche Rezeptvorschau; Details, Favoriten und persönliche Aktionen nach Login
- geschützte Online-Suche über TheMealDB, Open Food Facts und USDA
- einfacher Meal Planner mit Körperdaten, geschätztem Tagesziel und Dropdowns für Frühstück, Mittagessen und Abendessen
- direkte Übernahme ausgewählter Mahlzeiten ins Tracking
- Tracking von Kalorien, Protein, Kohlenhydraten und Fett
- Sieben-Tage-Fortschrittsansicht
- persönliche Favoriten, Einkaufsliste und Clerk-Profilseite
- gemeinsamer Header und Footer ohne Sidebar
- dunkles Restaurant-Design mit Gold-Akzent, inspiriert von der angegebenen Gericht-Referenz, aber mit eigenem FitMeal-Inhalt und Branding

Workout-Seiten sind nicht mehr Teil der sichtbaren Nutrition-App. Alte Workout-Dateien können noch als technische Rückfallkopie im Repository vorhanden sein.

## Einrichtung

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Erforderliche Variablen in `client/.env`:

| Variable | Zweck |
|---|---|
| `VITE_API_URL` | Backend-Basis-URL, lokal `http://localhost:5000/api` |
| `VITE_CLERK_PUBLISHABLE_KEY` | Publishable Key der gemeinsamen Clerk-Anwendung |

Keine Secret Keys in `client/.env` speichern. `CLERK_SECRET_KEY` gehört ausschließlich ins Backend.

## Befehle

```bash
npm run dev      # Entwicklungsserver
npm run lint     # ESLint
npm run build    # Produktions-Build
npm run preview  # lokalen Produktions-Build anzeigen
```

## Authentifizierung und API

`RouterApp.jsx` verbindet Clerks Auth-Status mit TanStack Router und dem gemeinsamen API-Client. Für geschützte Requests holt `apiClient.js` ein Clerk-JWT und sendet es als Bearer Token. Bei einem `401` wird einmal ein frischer Token angefordert und der Request wiederholt.

Die Online-Suche unter `/discover` ist vollständig geschützt. Andere Fachseiten können eine öffentliche Vorschau zeigen; beim ersten persönlichen Vorgang öffnet sich das Clerk-Login.

## Daten und Persistenz

- Favoriten und Tracking-Einträge: MongoDB über das Backend
- Einkaufsliste: `localStorage`, getrennt nach Clerk-User-ID
- Meal-Planner-Eingaben und aktuelle Auswahl: nur im Arbeitsspeicher; ein Browser-Refresh startet bewusst mit leeren Feldern
- Clerk-Profil und Sitzung: Clerk

Weitere Details stehen in [spec.md](spec.md). Die Quellstruktur ist in [src/README.md](src/README.md) beschrieben.
