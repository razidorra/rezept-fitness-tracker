import { Outlet, Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./App.css";

function App() {
  return (
    <>
      <header className="main-nav">
        <Link to="/" activeOptions={{ exact: true }} className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
              <path
                d="M12 20.5c-.3 0-.6-.1-.8-.3-2.2-1.9-4.1-3.6-5.5-5.3C4.1 13 3 11.1 3 9.2 3 6.6 5 4.6 7.5 4.6c1.4 0 2.7.6 3.6 1.7l.9 1 .9-1c.9-1.1 2.2-1.7 3.6-1.7 2.5 0 4.5 2 4.5 4.6 0 1.9-1.1 3.8-2.7 5.7-1.4 1.7-3.3 3.4-5.5 5.3-.2.2-.5.3-.8.3Z"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand-word">
            Fit<span className="brand-word-accent">Meal</span>
          </span>
        </Link>

        <nav className="main-links">
          <Link to="/" activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/recipes">Recipes</Link>
          <Link to="/tracking">Tracking</Link>
          <Link to="/workouts">Workouts</Link>
        </nav>

        <div className="nav-actions">
          <SignedOut>
            <Link to="/login" className="nav-login">
              Log in
            </Link>
            <Link to="/register" className="nav-signup">
              Sign up
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
