# Frontend-Quellstruktur

Das Frontend ist nach Features organisiert. Seiten enthalten Darstellung und UI-Zustand; API-Zugriffe liegen in den jeweiligen `api/`-Modulen.

## Zentrale Dateien

- `main.jsx`: React- und Clerk-Einstieg
- `RouterApp.jsx`: synchronisiert Clerk mit Router und API-Token-Provider
- `router.jsx`: Route Tree und Schutz von `/discover`
- `App.jsx`: gemeinsamer Header, Footer und Route-Outlet
- `index.css`: Tailwind-Import, Design-Tokens, Typografie und globales Restaurant-Theme
- `App.css`: Header-, Footer-, Profil- und responsive Layout-Regeln

## Verzeichnisse

- `features/auth`: Clerk-Login und Registrierung
- `features/dashboard`: Landingpage und eingeloggtes Dashboard
- `features/recipes`: lokaler Rezeptkatalog, Online-Suche und Favoriten
- `features/catalog`: Online Search und öffentliche Food-/Meal-Katalog-APIs
- `features/nutrition`: Produktsuche und Übergabe ans Tracking
- `features/meal-planner`: Tagesziel, Mahlzeiten-Dropdowns und Planner-Speicher
- `features/tracking`: persönliche Ernährungseinträge
- `features/progress`: Sieben-Tage-Auswertung
- `features/favorites`: gespeicherte Rezepte
- `features/shopping-list`: lokale Einkaufsliste
- `features/profile` und `features/settings`: Clerk-Kontoverwaltung
- `shared/api`: gemeinsamer Fetch-Client mit Clerk-Token-Retry
- `shared/components`: AppShell, Karten und gemeinsame Icons

## Datenfluss

```text
React Page → Feature API → shared/api/apiClient.js → Express API
                                               ↘ Clerk Bearer Token
```

Der Meal Planner berechnet eine erwachsene Schätzung mit der Mifflin–St.-Jeor-Gleichung und Aktivitätsfaktoren. Das Ergebnis ist allgemeine Orientierung und kein medizinischer Rat.

Siehe [../spec.md](../spec.md) für Routen, Sichtbarkeit, State und API-Verträge.
