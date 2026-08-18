import { SignInButton, SignedIn, SignedOut, UserProfile, useUser } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <AppShell>
      <SignedIn>
        <section className="mx-auto max-w-5xl">
          <div className="mb-7 flex items-center gap-4 rounded-lg border border-border bg-surface p-5 shadow-sm">
            <img
              src={user?.imageUrl}
              alt=""
              className="h-16 w-16 rounded-full border border-border object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-accent">Your FitMeal account</p>
              <h1 className="mt-1 mb-0! text-2xl! sm:text-3xl!">
                {user?.fullName || user?.username || "My Profile"}
              </h1>
              <p className="mt-1 text-sm text-text">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          <div className="profile-settings">
            <UserProfile routing="hash" />
          </div>
        </section>
      </SignedIn>

      <SignedOut>
        <section className="mx-auto max-w-lg rounded-lg border border-accent-border bg-accent-bg p-6 text-center">
          <h1 className="text-2xl!">Your profile is private</h1>
          <p className="mt-2 mb-5 text-sm">Log in to view and manage your FitMeal profile.</p>
          <SignInButton mode="modal">
            <button type="button" className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink">Log in</button>
          </SignInButton>
        </section>
      </SignedOut>
    </AppShell>
  );
}
