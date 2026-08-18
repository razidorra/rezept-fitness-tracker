import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import RouterApp from "./RouterApp.jsx";

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const root = createRoot(document.getElementById("root"));

if (!publishableKey) {
  root.render(<p className="p-6"><code>VITE_CLERK_PUBLISHABLE_KEY</code> fehlt in <code>client/.env</code>.</p>);
} else {
  root.render(
    <StrictMode>
      <ClerkProvider publishableKey={publishableKey} signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" afterSignOutUrl="/">
        <RouterApp />
      </ClerkProvider>
    </StrictMode>,
  );
}
