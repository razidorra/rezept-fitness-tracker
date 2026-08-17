import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { RouterProvider } from "@tanstack/react-router";
import "./index.css";
import { router } from "./router.jsx";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById("root"));

// Reicht Clerks aktuellen Auth-Status an den Router weiter, damit die
// beforeLoad-Guards in router.jsx (requireAuth) wissen, ob jemand eingeloggt ist.
// Clerk lädt asynchron (isLoaded startet als false) -- ohne das router.invalidate()
// hier würde eine beforeLoad-Prüfung, die VOR dem Laden durchlief, nie wiederholt,
// selbst wenn Clerk danach "nicht eingeloggt" feststellt. invalidate() lässt den
// Router die aktuelle Route (und ihre beforeLoad-Guards) mit dem neuen auth-Wert
// erneut prüfen.
function InnerApp() {
  const auth = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [auth.isLoaded, auth.isSignedIn]);

  return <RouterProvider router={router} context={{ auth }} />;
}

if (!CLERK_PUBLISHABLE_KEY) {
  // Verhindert eine leere weiße Seite, solange kein echter Key in client/.env steht.
  root.render(
    <p style={{ fontFamily: "sans-serif", padding: 24 }}>
      <code>VITE_CLERK_PUBLISHABLE_KEY</code> fehlt in <code>client/.env</code>. Key
      auf{" "}
      <a href="https://dashboard.clerk.com/last-active?path=api-keys">
        dashboard.clerk.com
      </a>{" "}
      holen, eintragen, Dev-Server neu starten.
    </p>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <InnerApp />
      </ClerkProvider>
    </StrictMode>,
  );
}
