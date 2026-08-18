import AppShell from "../../../shared/components/AppShell.jsx";
import { SignedIn, SignedOut, SignInButton, UserProfile } from "@clerk/clerk-react";

export default function SettingsPage() {
  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Settings</h1>
      <SignedIn><div className="mt-5"><UserProfile routing="hash" /></div></SignedIn>
      <SignedOut>
        <div className="mt-5 max-w-lg rounded-lg border border-accent-border bg-accent-bg p-5">
          <h2 className="text-lg!">Account settings</h2>
          <p className="mb-4 text-sm">Sign in to manage your profile and security settings.</p>
          <SignInButton mode="modal"><button type="button" className="rounded-pill bg-accent px-5 py-2 text-sm font-semibold text-accent-ink">Log in</button></SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}
