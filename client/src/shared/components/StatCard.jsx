// Wiederverwendbare Kennzahlen-Kachel, Stil an die Dashboard-Referenzen angelehnt
// (weiße Karte, gedämpftes Label, große Zahl, optionales Icon in grüner Fläche).
// Wird per Props gefüttert -- kein eigener State, keine Daten-Logik hier.
//
// Beispiel:
//   <StatCard label="Kalorien heute" value={1850} unit="kcal" icon={<FlameIcon />} />
//
// Für ein Grid aus mehreren Kacheln (z.B. Sleep/Steps/Food/Heart wie in der
// Referenz): einfach mehrere <StatCard /> in einen Tailwind-Grid-Container
// packen, z.B. className="grid grid-cols-2 gap-4 sm:grid-cols-4"

export default function StatCard({ label, value, unit, icon }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg bg-surface p-6 shadow-sm">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-bg text-text-h">
          {icon}
        </div>
      )}
      <div className="text-sm text-text">{label}</div>
      <div className="text-3xl font-semibold text-text-h">
        {value}
        {unit && <span className="ml-1 text-base font-normal text-text">{unit}</span>}
      </div>
    </div>
  );
}
