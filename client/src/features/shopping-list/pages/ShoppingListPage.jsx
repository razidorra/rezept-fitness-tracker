import { useState } from "react";
import { SignInButton, useAuth } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import { loadShoppingList, saveShoppingList } from "../shoppingListStorage.js";

export default function ShoppingListPage() {
  const { isSignedIn, userId } = useAuth();

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Shopping List</h1>
      <p className="text-text">Ingredients from your meal plan appear here automatically.</p>
      {!isSignedIn ? <div className="mt-5 max-w-lg rounded-lg border border-accent-border bg-accent-bg p-5"><h2 className="text-lg!">Your personal list</h2><p className="mb-4 text-sm">Sign in to create and manage your shopping list.</p><SignInButton mode="modal"><button className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink">Log in</button></SignInButton></div> : <ShoppingListContent key={userId} userId={userId} />}
    </AppShell>
  );
}

function ShoppingListContent({ userId }) {
  const [items, setItems] = useState(() => loadShoppingList(userId));
  const [name, setName] = useState("");

  function commit(nextItems) {
    setItems(saveShoppingList(userId, nextItems));
  }

  function add(event) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    commit([...items, { id: String(Date.now()), name: trimmed, measure: "", checked: false }]);
    setName("");
  }

  return <>
        <form onSubmit={add} className="mt-6 flex max-w-xl gap-2"><label htmlFor="shopping-item" className="sr-only">New shopping item</label><input id="shopping-item" required maxLength="120" value={name} onChange={(event) => setName(event.target.value)} placeholder="Add an item" className="min-w-0 flex-1 rounded-md border border-border bg-surface px-3 py-2" /><button className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink">Add</button></form>
        <div className="mt-6 max-w-2xl space-y-2">
          {items.length === 0 ? <p>Your list is empty. Add a meal from the Meal Planner.</p> : items.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-md border border-border bg-surface p-3"><input type="checkbox" checked={item.checked} onChange={() => commit(items.map((entry) => entry.id === item.id ? { ...entry, checked: !entry.checked } : entry))} aria-label={`Mark ${item.name} as bought`} /><span className={`flex-1 ${item.checked ? "line-through opacity-55" : ""}`}>{item.measure && <span className="text-text">{item.measure} </span>}{item.name}</span><button type="button" onClick={() => commit(items.filter((entry) => entry.id !== item.id))} className="text-sm font-medium text-red-600">Remove</button></div>)}
        </div>
        {items.length > 0 && <button type="button" onClick={() => commit(items.filter((item) => !item.checked))} className="mt-4 text-sm font-semibold text-accent">Remove checked items</button>}
      </>;
}
