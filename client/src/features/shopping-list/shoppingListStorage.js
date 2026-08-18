function storageKey(userId) {
  return `fitmeal:shopping-list:${userId}`;
}

export function loadShoppingList(userId) {
  if (!userId) return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveShoppingList(userId, items) {
  if (userId) localStorage.setItem(storageKey(userId), JSON.stringify(items));
  return items;
}

export function addIngredients(userId, ingredients) {
  const current = loadShoppingList(userId);
  const known = new Set(current.map((item) => item.name.toLocaleLowerCase()));
  const additions = ingredients
    .filter((ingredient) => ingredient.name && !known.has(ingredient.name.toLocaleLowerCase()))
    .map((ingredient, index) => ({
      id: `${Date.now()}-${index}`,
      name: ingredient.name,
      measure: ingredient.measure || "",
      checked: false,
    }));
  return saveShoppingList(userId, [...current, ...additions]);
}
