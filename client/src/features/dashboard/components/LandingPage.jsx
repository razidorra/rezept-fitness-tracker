import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroBowl from "../../../assets/hero-bowl.jpg";

// Marketing-Startseite für ausgeloggte Besucher:innen (SignedOut-Zweig von
// HomePage.jsx). Reine Präsentation, keine echten Daten -- die Zahlen im
// Phone-Mockup und die Nutzerzahl sind Platzhalter fürs Layout.
//
// Hero-Foto: client/src/assets/hero-bowl.jpg -- als JPEG (Qualität 85)
// komprimierte Version von assets/Hero.png (Original ~2.8MB PNG, unverändert
// im Ordner belassen). Quelle/Rechte am Originalfoto liegen beim Projekt.
//
// Videos: public/videos/*.mp4 -- von Pexels (pexels.com/search/videos/workout),
// heruntergeladen + mit ffmpeg auf Web-Größe transkodiert (1280x720, ohne Ton,
// da Original-Clips keine Tonspur mit Inhalt hatten). Direkt unter public/
// abgelegt statt importiert, weil Vite Videos sonst durch den JS-Bundle-Hash
// jagt -- als statische Datei reicht ein einfacher /videos/...-Pfad.

const FEATURES = [
  {
    icon: <UtensilsIcon />,
    title: "Track Nutrition",
    description: "Easily track calories and macros.",
    to: "/tracking",
  },
  {
    icon: <BookIcon />,
    title: "Healthy Recipes",
    description: "Discover and save delicious recipes.",
    to: "/recipes",
  },
  {
    icon: <DumbbellIcon />,
    title: "Workout Plans",
    description: "Custom workouts for all fitness levels.",
    to: "/workouts",
  },
  {
    icon: <ChartIcon />,
    title: "See Progress",
    description: "Visualize your progress and stay motivated.",
    to: "/tracking",
  },
];

const MEALS = [
  { label: "Breakfast", name: "Protein Oatmeal", kcal: 420, protein: 28 },
  { label: "Lunch", name: "Chicken Rice Bowl", kcal: 650, protein: 48 },
  { label: "Dinner", name: "Salmon & Veggies", kcal: 540, protein: 38 },
];

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  // Esc schließt das Modal, ohne dass man erst die Maus zum X bewegen muss.
  useEffect(() => {
    if (!demoOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && setDemoOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [demoOpen]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 pb-16">
      {/* Hero */}
      <section className="grid items-center gap-16 pt-6 md:grid-cols-2 md:gap-10 md:pb-14">
        <div className="flex flex-col items-start gap-5">
          <span className="rounded-pill bg-accent-bg px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
            Track. Eat. Achieve.
          </span>
          <h1 className="text-4xl! leading-tight! md:text-5xl!">
            Your Fitness Journey Starts with{" "}
            <span className="text-accent">Every Meal</span>
          </h1>
          <p className="max-w-md text-text">
            FitMeal helps you track your nutrition, discover healthy recipes,
            and reach your fitness goals -- all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/register"
              className="rounded-pill bg-accent px-6 py-3 font-semibold text-accent-ink shadow-sm transition-opacity hover:opacity-85"
            >
              Get Started Free
            </Link>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-text-h"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                <PlayIcon />
              </span>
              Watch Demo
            </button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {["AB", "CD", "EF", "GH"].map((initials) => (
                <span
                  key={initials}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bg bg-surface-inverted text-[11px] font-semibold text-text-on-inverted"
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm text-text">
              Join <span className="font-semibold text-text-h">10,000+</span>{" "}
              users and start your transformation today!
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:ml-auto md:mr-0 md:max-w-none">
          <img
            src={heroBowl}
            alt="Bowl with chicken, broccoli, quinoa, avocado, and cherry tomatoes"
            className="aspect-square w-full rounded-lg object-cover shadow-sm md:aspect-[4/3]"
          />
          <div className="mt-6 md:absolute md:top-8 md:-left-8 md:mt-0 md:w-64">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* Feature-Strip */}
      <section
        id="features"
        className="grid scroll-mt-24 grid-cols-2 gap-4 lg:grid-cols-4"
      >
        {FEATURES.map((feature) => (
          <Link
            key={feature.title}
            to={feature.to}
            className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-sm transition-colors hover:border-accent-border"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-bg text-accent">
              {feature.icon}
            </div>
            <h2 className="mb-0! text-base!">{feature.title}</h2>
            <p className="text-sm text-text">{feature.description}</p>
          </Link>
        ))}
      </section>

      {/* Alles was du brauchst */}
      <section className="flex flex-col items-center gap-4 text-center">
        <span className="text-xs font-semibold tracking-wide text-accent uppercase">
          Built for Your Goals
        </span>
        <h2 className="text-2xl! md:text-3xl!">
          Everything You Need to Succeed
        </h2>
        <p className="max-w-xl text-text">
          FitMeal combines nutrition tracking, healthy recipes, and workout
          planning to help you build healthy habits and achieve your goals.
        </p>

        <div className="mt-6 grid gap-6 text-left md:grid-cols-3">
          <DetailCard
            icon={<UtensilsIcon />}
            title="Nutrition at a Glance"
            description="Log meals and let calories and macros add up automatically."
            to="/tracking"
          />
          <DetailCard
            icon={<BookIcon />}
            title="Discover Recipes"
            description="Search for recipes, check nutrition facts, and save your favorites."
            to="/recipes"
          />
          <DetailCard
            icon={<DumbbellIcon />}
            title="Plan Workouts"
            description="Put together workouts for any level and track your progress."
            to="/workouts"
          />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="flex flex-col items-center gap-4 rounded-lg bg-surface-inverted px-8 py-14 text-center text-text-on-inverted">
        <h2 className="mb-0! text-2xl! text-text-on-inverted! md:text-3xl!">
          Ready to get started?
        </h2>
        <p className="max-w-md text-text-on-inverted/80">
          Sign up for free and log your first meal today.
        </p>
        <Link
          to="/register"
          className="mt-2 rounded-pill bg-accent px-6 py-3 font-semibold text-accent-ink shadow-sm transition-opacity hover:opacity-85"
        >
          Get Started Free
        </Link>
      </section>

      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setDemoOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDemoOpen(false)}
              aria-label="Close video"
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full text-text-on-inverted hover:opacity-80"
            >
              <CloseIcon />
            </button>
            <video
              src="/videos/demo.mp4"
              poster="/videos/demo-poster.jpg"
              controls
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ icon, title, description, to }) {
  return (
    <Link
      to={to}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6 shadow-sm transition-colors hover:border-accent-border"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-bg text-accent">
        {icon}
      </div>
      <h3 className="mb-0! text-base! font-medium text-text-h">{title}</h3>
      <p className="text-sm text-text">{description}</p>
    </Link>
  );
}

function PhoneMockup() {
  const kcalGoal = 2300;
  const kcalNow = 1720;
  const pct = Math.round((kcalNow / kcalGoal) * 100);
  const macros = [
    { label: "Protein", now: 115, goal: 160, color: "#16a34a" },
    { label: "Carbs", now: 180, goal: 250, color: "#f59e0b" },
    { label: "Fat", now: 55, goal: 70, color: "#ef4444" },
  ];

  return (
    <div className="w-full rounded-[2.2rem] bg-black p-2.5 shadow-xl">
      <div className="relative overflow-hidden rounded-[1.7rem] bg-surface">
        {/* Dynamic-Island-Notch */}
        <div className="absolute top-2 left-1/2 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

        {/* Statusleiste */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[11px] font-semibold text-text-h">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <SignalIcon />
            <WifiIcon />
            <BatteryIcon />
          </div>
        </div>

        <div className="px-4 pt-2 pb-3">
          <p className="mb-0! text-sm font-medium text-text-h">Hello, Alex 👋</p>
          <p className="mb-4 text-xs text-text">Today's Progress</p>

          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#3b82f6 0% 45%, #16a34a 45% 60%, #f59e0b 60% ${pct}%, var(--border) ${pct}% 100%)`,
              }}
            >
              <div className="flex h-15 w-15 flex-col items-center justify-center rounded-full bg-surface text-center">
                <span className="text-sm font-semibold text-text-h">
                  {kcalNow}
                </span>
                <span className="text-[10px] text-text">/ {kcalGoal} kcal</span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              {macros.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[11px] text-text">
                    <span>{m.label}</span>
                    <span>
                      {m.now}/{m.goal}g
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-pill bg-border">
                    <div
                      className="h-full rounded-pill"
                      style={{
                        width: `${Math.min((m.now / m.goal) * 100, 100)}%`,
                        background: m.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="mb-0! text-xs font-semibold text-text-h">
              Today's Meals
            </p>
            <span className="text-xs text-accent">See all</span>
          </div>

          <ul className="mt-3 flex flex-col gap-3">
            {MEALS.map((meal) => (
              <li key={meal.label} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-bg text-sm">
                  🍽️
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mb-0! text-xs text-text">{meal.label}</p>
                  <p className="mb-0! truncate text-sm text-text-h">
                    {meal.name}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text">
                  {meal.kcal} kcal · {meal.protein}g
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tab bar */}
        <div className="flex items-end justify-between border-t border-border px-5 pt-2 pb-3">
          <TabItem icon={<HomeIcon />} label="Home" active />
          <TabItem icon={<BookIcon />} label="Recipes" />
          <span className="-mt-6 flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-ink shadow-md">
            <PlusIcon />
          </span>
          <TabItem icon={<DumbbellIcon />} label="Workouts" />
          <TabItem icon={<PersonIcon />} label="Profile" />
        </div>
      </div>
    </div>
  );
}

function TabItem({ icon, label, active }) {
  return (
    <div
      className={`flex flex-col items-center gap-0.5 ${active ? "text-accent" : "text-text"}`}
    >
      {icon}
      <span className="text-[9px] font-medium">{label}</span>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" width="14" height="10" fill="currentColor">
      <rect x="0" y="7" width="3" height="5" rx="0.5" />
      <rect x="5" y="5" width="3" height="7" rx="0.5" />
      <rect x="10" y="3" width="3" height="9" rx="0.5" />
      <rect x="15" y="0" width="3" height="12" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 16 12" width="14" height="10" fill="none">
      <path
        d="M1 4.5c3.9-3.7 10.1-3.7 14 0M3.3 7.2a7 7 0 0 1 9.4 0M5.7 9.8a3.5 3.5 0 0 1 4.6 0"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="8" cy="11.3" r="0.8" fill="currentColor" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 12" width="20" height="10" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="20"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="2" y="2" width="15" height="8" rx="1.2" fill="currentColor" />
      <rect x="21.5" y="4" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M4 11.5 12 4l8 7.5M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
      <path d="M7 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />
    </svg>
  );
}

function UtensilsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M7 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M9 3v18M17 3c-1.7 0-3 2.5-3 5.5S15.3 14 17 14s3-2.5 3-5.5S18.7 3 17 3ZM17 14v7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5A1.5 1.5 0 0 1 18.5 20H6.5A2.5 2.5 0 0 1 4 17.5v-12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DumbbellIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M4 9v6M2 10.5v3M8 7v10M16 7v10M20 10.5v3M22 9v6M8 12h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
      <path
        d="M4 20V10M11 20V4M18 20v-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
