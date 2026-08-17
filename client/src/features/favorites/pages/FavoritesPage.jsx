// Platzhalter-Seite, verlinkt aus der Sidebar auf RecipesPage.jsx (siehe
// deren Kommentar oben). Die Herz-Buttons auf der Recipes-Seite sind aktuell
// nur lokaler Component-State (kein Speichern) -- für eine echte Favorites-
// Seite bräuchtest du entweder POST /api/recipes (siehe server/spec.md) oder
// zumindest geteilten State/localStorage zwischen den beiden Seiten.

export default function FavoritesPage() {
  return <h1>Favorites</h1>;
}
