# Frontend-Spezifikation – FitMeal Client

Diese Datei beschreibt das aktuell implementierte Verhalten des Clients. Die Backend-Verträge stehen in [`../server/spec.md`](../server/spec.md).

## Basis

- Dev-URL: `http://localhost:5173`
- API-Basis: `VITE_API_URL`, standardmäßig `http://localhost:5000/api`
- Sprache der Oberfläche: überwiegend Englisch
- Auth-Provider: Clerk
- Router: TanStack Router

## Routen und Sichtbarkeit

| Route | Seite | Ohne Login | Mit Login |
|---|---|---|---|
| `/` | Home | vollständige Landingpage | Dashboard plus Landingpage |
| `/login` | Login | Clerk SignIn | verfügbar |
| `/register` | Registrierung | Clerk SignUp | verfügbar |
| `/recipes` | Rezepte | Karten und Suche sichtbar; Details öffnen Login | Details, Nährwerte, Favoriten und Planner-Aktion |
| `/discover` | Online Search | Redirect nach `/login` und nicht im Header | Suche nach Rezepten und Lebensmitteln |
| `/nutrition` | Nutrition | Suchvorschau; Tracking-Aktion öffnet Login | Produkte direkt tracken |
| `/meal-planner` | Meal Planner | Felder ausfüllbar; Berechnung öffnet Login | Tagesziel berechnen und Mahlzeiten tracken |
| `/tracking` | Tracking | Formularvorschau; Absenden öffnet Login | Einträge erstellen/löschen und Tagesbudget sehen |
| `/progress` | Progress | Login-Hinweis | Sieben-Tage-Auswertung |
| `/favorites` | Favoriten | Login-Hinweis | gespeicherte Rezepte |
| `/shopping-list` | Einkaufsliste | Login-Hinweis | persönliche lokale Liste |
| `/profile` | Profil | Login-Hinweis | Clerk UserProfile |
| `/settings` | Einstellungen | Login-Hinweis | Clerk UserProfile |

## Header und Footer

- auf allen Routen zentral in `App.jsx`
- kein Sidebar-Navigationssystem
- Online Search und My Profile erscheinen nur im eingeloggten Zustand
- Header wird durch eine goldene Linie und einen dezenten Schatten vom Inhalt getrennt
- das FitMeal-Logo verlinkt auf `/` und scrollt nach oben
- Clerk `UserButton` enthält Logout und Account-Funktionen

## Recipes

- acht lokale FitMeal-Rezepte mit Bild, Zutaten, Zubereitung, Kalorien, Protein, Kohlenhydraten, Fett und Ballaststoffen
- Filter nach Kategorie und Ernährungsmerkmal
- Online-Suche über `findMeals()`/TheMealDB
- Online-Rezepte ohne verifizierte Nährwerte werden nicht als berechenbare Mahlzeit ausgegeben
- Favoriten werden über `/api/recipes` in MongoDB gespeichert
- lokale Rezepte können in den aktuellen Meal-Plan-Speicher übernommen werden

## Meal Planner

Eingaben:

- Gewicht, Größe, Alter
- Gleichungseinstellung weiblich/männlich
- Aktivitätsniveau
- Ziel: langsam abnehmen, halten oder langsam zunehmen

Nach der Berechnung zeigt der Client:

- geschätztes Tagesziel
- bereits getrackte Kalorien
- verbleibende Kalorien
- Dropdowns für Frühstück (25 %), Mittagessen (35 %) und Abendessen (30 %)
- verbleibendes oder überschrittenes Richtbudget pro Mahlzeit

Der Button **Add selected meals to Tracking** erstellt für jede Auswahl einen `POST /api/tracking`-Eintrag. Eine Auswahl, die das gesamte Tagesziel überschreitet, wird nicht gespeichert. Die Aufteilung ist eine einfache Orientierung, keine medizinische Vorgabe.

Die optionale TheMealDB-Inspiration erscheint im Meal Planner nur nach Login und kann Zutaten zur Einkaufsliste hinzufügen. Da TheMealDB keine verifizierten Kalorien bereitstellt, werden diese externen Gerichte nicht automatisch getrackt.

## Tracking und Progress

- manuelle Einträge oder Produktauswahl aus Open Food Facts/USDA
- persönliche Einträge werden über die Backend-API geladen, erstellt und gelöscht
- Mahlzeiten aus dem Planner tragen Präfixe wie `Breakfast:` oder `Dinner:`
- Tracking berechnet Tagesgesamtwert und Richtbudgets je Mahlzeit
- Progress aggregiert die letzten sieben Tage nach Kalorien und Makros

## API-Client

`shared/api/apiClient.js`:

1. setzt JSON-Header und Basis-URL,
2. holt bei `auth: true` ein Clerk-JWT,
3. sendet `Authorization: Bearer <token>`,
4. versucht bei `401` einmal einen Token mit `skipCache: true`,
5. normalisiert Backend-Fehler als JavaScript `Error` mit `status`.

TheMealDB besitzt zusätzlich einen direkten Client-Fallback, falls ein alter lokaler Server `/api/catalog/meals` noch mit `404` beantwortet oder der Backend-Request nicht erreichbar ist.

## Persistenz

| Daten | Speicher | Refresh-Verhalten |
|---|---|---|
| Clerk-Sitzung/Profil | Clerk | bleibt gemäß Clerk-Sitzung erhalten |
| Favoriten | MongoDB | bleibt erhalten |
| Tracking/Progress | MongoDB | bleibt erhalten |
| Einkaufsliste | `localStorage` je User-ID | bleibt erhalten |
| Planner-Profil und Tagesauswahl | Modul-Speicher | wird bei vollem Refresh geleert |

## Design

Das aktuelle Theme orientiert sich visuell an einer hochwertigen Restaurantseite:

- Hintergrund `#0C0C0C`
- Karten `#121212`/`#1E1E1E`
- Gold `#DCCA87`
- Text Weiß/Grau
- Überschriften: Cormorant Upright
- Fließtext: Open Sans
- kleine Radien und goldene, fast eckige Buttons

Die Referenz beeinflusst nur die visuelle Richtung. Inhalte, Komponenten, Bilder und FitMeal-Branding sind projektspezifisch.

## Qualitätschecks

```bash
npm run lint
npm run build
```
