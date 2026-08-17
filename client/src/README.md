# Client – Ordnerstruktur (feature-basiert)

Der Code ist wie im Backend nach **Fachlichkeit** gruppiert statt nach Dateityp. Alles, was zu `auth`, `recipes` bzw. `tracking` gehört, liegt zusammen in einem Feature-Ordner.

```
src/
├── main.jsx              # React-Einstiegspunkt, rendert <App />
├── App.jsx               # Root-Komponente (aktuell noch Vite-Standard-Template)
├── App.css / index.css   # globale Styles
├── assets/                # Bilder/Icons
├── features/
│   ├── auth/
│   │   ├── components/     # kleine, wiederverwendbare UI-Teile nur für Auth (z.B. LoginForm)
│   │   ├── pages/           # ganze Seiten (z.B. LoginPage, RegisterPage)
│   │   └── api/              # Fetch-/Axios-Calls gegen /api/auth/...
│   ├── recipes/
│   │   ├── components/      # z.B. RecipeCard, RecipeSearchBar
│   │   ├── pages/             # z.B. RecipeSearchPage, SavedRecipesPage
│   │   └── api/                # Calls gegen /api/recipes/...
│   └── tracking/
│       ├── components/      # z.B. TrackingEntryForm, DailyChart
│       ├── pages/             # z.B. TrackingDashboardPage
│       └── api/                # Calls gegen /api/tracking/...
└── shared/
    ├── components/          # generische UI-Bausteine, die mehrere Features nutzen (Button, Modal, Navbar, ...)
    ├── hooks/                # generische Hooks, die mehrere Features nutzen (z.B. useAuth, useFetch)
    └── api/                   # gemeinsame API-Basis (z.B. fetch-Wrapper mit Base-URL, Auth-Header)
```

## Status

Die Feature-Ordner sind aktuell noch **leer** (nur `.gitkeep`, damit sie als Platzhalter bestehen bleiben) — `App.jsx` ist noch das unveränderte Vite-Template. Das ist der nächste Schritt: sobald Routing (z.B. `react-router-dom`) eingerichtet ist, ziehen hier echte Seiten und Komponenten ein, die die Backend-Endpunkte aus `server/features/*` ansprechen.

## Faustregel: `components/` vs. `pages/` vs. `shared/`

- **`features/<name>/components/`** – UI-Baustein, der nur innerhalb dieses einen Features Sinn ergibt.
- **`features/<name>/pages/`** – eine ganze Route/Ansicht, baut sich aus Components zusammen.
- **`shared/`** – wird von **mehr als einem** Feature gebraucht (z.B. ein `Button`, die Navigationsleiste, der `fetch`-Wrapper).
