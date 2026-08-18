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
    icon: <ChartIcon />,
    title: "Meal Planning",
    description: "Build a daily plan around your nutrition goals.",
    to: "/meal-planner",
  },
  {
    icon: <ChartIcon />,
    title: "Food Database",
    description: "Look up nutrition values for real products.",
    to: "/nutrition",
  },
];

const MEALS = [
  { label: "Breakfast", name: "Protein Oatmeal", kcal: 420, protein: 28 },
  { label: "Lunch", name: "Chicken Rice Bowl", kcal: 650, protein: 48 },
  { label: "Dinner", name: "Salmon & Veggies", kcal: 540, protein: 38 },
];

export default function LandingPage({ authenticated = false }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-24 pb-16">
      {/* Hero */}
      <section className="grid items-center gap-16 pt-6 md:grid-cols-2 md:gap-10 md:pb-14">
        <div className="flex flex-col items-start gap-5">
          <span className="rounded-pill bg-accent-bg px-3 py-1 text-xs font-semibold tracking-wide text-accent uppercase">
            Track. Eat. Achieve.
          </span>
          <h1 className="text-5xl! leading-[0.98]! font-bold! md:text-7xl! lg:text-[5.5rem]!">
            Healthier Eating Starts with{" "}
            <span className="text-accent">Every Meal</span>
          </h1>
          <p className="max-w-md text-text">
            FitMeal helps you understand nutrition, discover balanced recipes,
            plan meals and build eating habits that work in everyday life.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Link
              to={authenticated ? "/recipes" : "/register"}
              className="rounded-pill bg-accent px-6 py-3 font-semibold text-accent-ink shadow-sm transition-opacity hover:opacity-85"
            >
              {authenticated ? "Explore Recipes" : "Get Started Free"}
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 text-sm font-medium text-text-h"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border">
                <PlayIcon />
              </span>
              How FitMeal works
            </a>
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
              <span className="font-semibold text-text-h">Clear nutrition tools</span>{" "}
              for everyday meals, personal goals and informed choices.
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
          FitMeal combines nutrition tracking, healthy recipes and practical
          meal planning to make balanced eating easier to understand.
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
            icon={<ChartIcon />}
            title="Plan Balanced Days"
            description="Choose meals and drinks, compare them with your estimated daily target, and adjust your choices."
            to="/meal-planner"
          />
        </div>
      </section>

      {/* Kurze FitMeal-Story: Das Video liegt bereits im horizontalen 16:9-Format vor. */}
      <section
        aria-labelledby="fitmeal-video-title"
        className="overflow-hidden rounded-lg border border-accent-border bg-black shadow-xl"
      >
        <div className="relative aspect-video">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
            preload="metadata"
            aria-label="A short introduction to FitMeal"
          >
            <source
              src="/make_it_horizontal_and_can_u_p.mp4"
              type="video/mp4"
            />
            Your browser does not support HTML video.
          </video>
          <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent px-6 py-6 sm:px-10 sm:py-9">
            <span className="text-xs font-semibold tracking-wide text-accent uppercase">
              Made for everyday life
            </span>
            <h2
              id="fitmeal-video-title"
              className="mt-2 max-w-xl text-2xl! text-white! sm:text-4xl!"
            >
              Healthy eating, made easier
            </h2>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="text-center"><span className="text-xs font-semibold uppercase tracking-wide text-accent">Simple by design</span><h2 className="mt-2 text-2xl! md:text-3xl!">From food choice to daily overview</h2><p className="mx-auto mt-3 max-w-2xl text-text">Use FitMeal as a practical companion—not as a replacement for individual medical or dietary advice.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">{[
          ["1", "Discover", "Browse balanced recipes or search trusted public food databases."],
          ["2", "Understand", "Compare calories, protein, carbohydrates, fat and fibre."],
          ["3", "Plan", "Combine meals, drinks and personal choices into one daily plan."],
          ["4", "Reflect", "Review seven-day nutrition trends and build consistent habits."],
        ].map(([number, title, text]) => <article key={number} className="rounded-lg border border-border bg-surface p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">{number}</span><h3 className="mt-4 text-base!">{title}</h3><p className="mt-2 text-sm text-text">{text}</p></article>)}</div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6 sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]"><div><span className="text-xs font-semibold uppercase tracking-wide text-accent">Nutrition basics</span><h2 className="mt-2 text-2xl!">A healthy diet is more than counting calories</h2><p className="mt-3 text-text">The WHO describes four foundations of healthy eating: adequacy, balance, moderation and diversity. Individual needs still vary with age, lifestyle, culture and health.</p><div className="mt-5 flex flex-wrap gap-3"><a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent">WHO guidance ↗</a><a href="https://www.dge.de/gesunde-ernaehrung/gut-essen-und-trinken/dge-empfehlungen/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent">DGE recommendations ↗</a></div></div><div className="grid gap-3 sm:grid-cols-2">{[
          ["🥕", "Eat varied and colourful", "Build meals around vegetables, fruit, pulses, whole grains, nuts and other nutrient-rich foods."],
          ["💧", "Choose water first", "Water and unsweetened drinks are practical everyday choices."],
          ["🌾", "Prefer fibre-rich foods", "Whole grains, vegetables, fruit and pulses support fibre intake and fullness."],
          ["⚖️", "Think in patterns", "One food does not define health. Overall balance, portions and regular habits matter."],
        ].map(([icon, title, text]) => <article key={title} className="rounded-md bg-bg p-4"><span className="text-2xl">{icon}</span><h3 className="mt-2 text-sm!">{title}</h3><p className="mt-1 text-xs text-text">{text}</p></article>)}</div></div>
      </section>

      <section className="overflow-hidden rounded-lg border border-accent-border bg-accent-bg p-7 sm:p-10">
        <div>
          <span className="inline-flex rounded-pill bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-ink">Coming soon</span>
          <h2 className="mt-4 text-2xl! md:text-3xl!">FitMeal will also be available as a mobile app</h2>
          <p className="mt-3 max-w-2xl text-text">We are planning a simple FitMeal app for your phone. It will give you quick access to recipes, nutrition tracking and your personal meal plan while you are on the go.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              ["1", "Download the app", "Get FitMeal from your phone’s app store when it becomes available."],
              ["2", "Use the same account", "Log in with your existing FitMeal account—no new profile needed."],
              ["3", "Continue anywhere", "Your planned meals, nutrition entries and progress will stay connected."],
            ].map(([number, title, text]) => <article key={number} className="rounded-md border border-accent-border bg-surface p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">{number}</span><h3 className="mt-3 text-base!">{title}</h3><p className="mt-2 text-sm text-text">{text}</p></article>)}
          </div>
          <p className="mt-5 text-xs text-text">The website remains fully usable. The mobile app is a planned additional option and is not available for download yet.</p>
        </div>
      </section>

      <section><div className="text-center"><span className="text-xs font-semibold uppercase tracking-wide text-accent">Questions</span><h2 className="mt-2 text-2xl!">Frequently asked</h2></div><div className="mx-auto mt-7 max-w-3xl space-y-3">{[
        ["Does FitMeal diagnose health conditions?", "No. FitMeal provides general information and estimates. Medical conditions, pregnancy, eating disorders or therapeutic diets require qualified professional advice."],
        ["Are calorie targets exact?", "No. They are estimates based on the information entered. Real needs can differ, so trends and wellbeing matter more than a single number."],
        ["Can one meal be called healthy or unhealthy?", "Context matters. FitMeal checks whether a choice fits the current plan, but it does not judge a single food in isolation."],
        ["Where does the nutrition data come from?", "Product data comes from Open Food Facts with USDA FoodData Central as a fallback. Recipe inspiration comes from TheMealDB."],
      ].map(([question, answer]) => <details key={question} className="rounded-lg border border-border bg-surface p-5"><summary className="cursor-pointer font-semibold text-text-h">{question}</summary><p className="mt-3 text-sm text-text">{answer}</p></details>)}</div></section>

      {/* Closing CTA */}
      <section className="flex flex-col items-center gap-4 rounded-lg bg-surface-inverted px-8 py-14 text-center text-text-on-inverted">
        <h2 className="mb-0! text-2xl! text-text-on-inverted! md:text-3xl!">
          {authenticated ? "Ready for your next healthy choice?" : "Ready to get started?"}
        </h2>
        <p className="max-w-md text-text-on-inverted/80">
          {authenticated ? "Continue building a meal plan that fits your goals." : "Sign up for free and log your first meal today."}
        </p>
        <Link
          to={authenticated ? "/meal-planner" : "/register"}
          className="mt-2 rounded-pill bg-accent px-6 py-3 font-semibold text-accent-ink shadow-sm transition-opacity hover:opacity-85"
        >
          {authenticated ? "Open Meal Planner" : "Get Started Free"}
        </Link>
      </section>

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
    { label: "Protein", now: 115, goal: 160, color: "var(--accent)" },
    { label: "Carbs", now: 180, goal: 250, color: "#c8b261" },
    { label: "Fat", now: 55, goal: 70, color: "#9f9060" },
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
                background: `conic-gradient(#ffffff 0% 45%, var(--accent) 45% 60%, #c8b261 60% ${pct}%, var(--border) ${pct}% 100%)`,
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
          <TabItem icon={<ChartIcon />} label="Planner" />
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
