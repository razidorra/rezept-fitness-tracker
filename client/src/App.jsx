import { Outlet, Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import "./App.css";

function Brand() {
  return (
    <Link to="/" activeOptions={{ exact: true }} className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="FitMeal home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path d="M12 20.5c-.3 0-.6-.1-.8-.3-2.2-1.9-4.1-3.6-5.5-5.3C4.1 13 3 11.1 3 9.2 3 6.6 5 4.6 7.5 4.6c1.4 0 2.7.6 3.6 1.7l.9 1 .9-1c.9-1.1 2.2-1.7 3.6-1.7 2.5 0 4.5 2 4.5 4.6 0 1.9-1.1 3.8-2.7 5.7-1.4 1.7-3.3 3.4-5.5 5.3-.2.2-.5.3-.8.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="brand-word">Fit<span className="brand-word-accent">Meal</span></span>
    </Link>
  );
}

function App() {
  return (
    <>
      <header className="main-nav">
        <Brand />
        <nav className="main-links" aria-label="Main navigation">
          <Link to="/" activeOptions={{ exact: true }}>Home</Link>
          <Link to="/recipes">Recipes</Link>
          <SignedIn><Link to="/discover">Online Search</Link></SignedIn>
          <Link to="/tracking">Tracking</Link>
          <Link to="/meal-planner">Meal Planner</Link>
        </nav>
        <div className="nav-actions">
          <SignedOut>
            <Link to="/login" className="nav-login">Log in</Link>
            <Link to="/register" className="nav-signup">Sign up</Link>
          </SignedOut>
          <SignedIn>
            <Link to="/profile" className="nav-profile">My Profile</Link>
            <UserButton />
          </SignedIn>
        </div>
      </header>

      <main className="app-main"><Outlet /></main>

      <footer className="site-footer">
        <nav className="footer-links" aria-label="Company links">
          <a href="/#features">About FitMeal</a>
          <Link to="/recipes">Recipes</Link>
          <Link to="/nutrition">Nutrition</Link>
          <Link to="/meal-planner">Meal Planner</Link>
          <Link to="/progress">Progress</Link>
        </nav>
        <nav className="social-links" aria-label="Social media">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="FitMeal on Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v7h4v-7h3.2l.8-4h-4V9c0-.7.3-1 1-1Z" /></svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="FitMeal on Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.2" /></svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="FitMeal on X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4.6l3.2 4.5L17 4h2l-5.3 6 5.8 10H15l-3.6-5.1L7 20H5l5.5-6.8L5 4Zm3.5 2 7.6 12h1.4L9.8 6H8.5Z" /></svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="FitMeal on GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5v-2.3c-2.6.6-3.2-1.1-3.2-1.1-.4-1.1-1-1.4-1-1.4-.9-.6 0-.6 0-.6 1 0 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.4-1.1.7-1.3-2.1-.2-4.3-1-4.3-4.7 0-1 .4-1.9 1-2.6-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 4.9 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.7.7 1 1.6 1 2.6 0 3.7-2.2 4.5-4.3 4.7.4.3.7.9.7 1.8v3.1A10 10 0 0 0 12 2Z" /></svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="FitMeal on YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.6 4.6 12 4.6 12 4.6s-5.6 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.9.5 7.5.5 7.5.5s5.6 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>
          </a>
        </nav>
        <p className="footer-bottom">© 2026 FitMeal. Eat well, plan simply, feel better.</p>
      </footer>
    </>
  );
}

export default App;
