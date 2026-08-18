import { SearchIcon } from "./icons.jsx";

// Shared content container for feature pages. Site-wide navigation and account
// controls live in App.jsx so every route receives the same header and footer.
export default function AppShell({ search, children }) {
  return (
    <div className="mx-auto w-full max-w-7xl">
      {search && (
        <form className="relative mb-6 max-w-xl" onSubmit={(event) => { event.preventDefault(); search.onSubmit?.(); }}>
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={search.value}
            onChange={(event) => search.onChange(event.target.value)}
            placeholder={search.placeholder ?? "Search..."}
            aria-label={search.placeholder ?? "Search"}
            className="w-full rounded-pill border border-border bg-surface py-2.5 pr-4 pl-10 text-sm text-text-h outline-none focus:border-accent-border"
          />
        </form>
      )}
      {children}
    </div>
  );
}
