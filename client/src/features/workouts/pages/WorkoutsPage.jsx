// TODO: List -> GET /api/workouts, create a workout -> POST /api/workouts,
// delete -> DELETE /api/workouts/:id (see server/spec.md, "Workouts" section).
// Backend is still 🚧 not implemented per spec.md (only the folder scaffold
// server/features/workouts/ exists) -- this page is only really testable once
// the backend part is done, same as RecipesPage.jsx / TrackingPage.jsx.
//
// Videos: public/videos/*.mp4 (+ poster jpgs). demo.mp4/pushup.mp4 are from
// Pexels (pexels.com/search/videos/workout); bodyweight.mp4 is a
// project-provided clip. All transcoded to web size (1280x720, muted) with
// ffmpeg -- see LandingPage.jsx's top comment for details. The preview cards
// below are just placeholders standing in for real workout data -- swap
// PREVIEWS out once GET /api/workouts returns something real.

const PREVIEWS = [
  {
    video: "/videos/demo.mp4",
    poster: "/videos/demo-poster.jpg",
    title: "Full-Body Strength",
    description: "Dumbbell deadlifts and rows to build total-body strength.",
  },
  {
    video: "/videos/pushup.mp4",
    poster: "/videos/pushup-poster.jpg",
    title: "Push-Up Power",
    description: "Bodyweight push-ups to build chest, shoulder, and core strength.",
  },
];

export default function WorkoutsPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="relative overflow-hidden rounded-lg">
        <video
          src="/videos/bodyweight.mp4"
          poster="/videos/bodyweight-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          className="h-64 w-full object-cover sm:h-80"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-6 sm:p-10">
          <h1 className="mb-0! text-3xl! text-white! sm:text-4xl!">
            Workouts
          </h1>
          <p className="max-w-md text-sm text-white/85 sm:text-base">
            Custom workout plans for every fitness level -- coming soon.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl!">A preview of what's coming</h2>
        <p className="text-text">
          This page will let you build and track workouts once the backend is
          ready. In the meantime, here's a taste of what workout plans could
          look like.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {PREVIEWS.map((preview) => (
            <div
              key={preview.title}
              className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm"
            >
              <video
                src={preview.video}
                poster={preview.poster}
                autoPlay
                loop
                muted
                playsInline
                className="aspect-video w-full object-cover"
              />
              <div className="p-4">
                <h3 className="mb-0! text-base! font-medium text-text-h">
                  {preview.title}
                </h3>
                <p className="text-sm text-text">{preview.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
