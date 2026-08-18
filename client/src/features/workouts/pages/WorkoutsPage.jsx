import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import AppShell from "../../../shared/components/AppShell.jsx";
import { createWorkout, deleteWorkout, getWorkouts } from "../api/workoutsApi.js";
import { searchExercises } from "../../catalog/api/catalogApi.js";

const today = new Date().toISOString().slice(0, 10);

export default function WorkoutsPage() {
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ name: "", duration: "", date: today, exerciseName: "", sets: "", reps: "", weight: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [exerciseQuery, setExerciseQuery] = useState("");
  const [exerciseResults, setExerciseResults] = useState([]);
  const [searchingExercises, setSearchingExercises] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }
    getWorkouts().then(setWorkouts).catch((err) => setError(err.message));
  }, [isSignedIn]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const optionalNumber = (value) => (value === "" ? undefined : Number(value));
      const exercises = form.exerciseName ? [{ name: form.exerciseName, sets: optionalNumber(form.sets), reps: optionalNumber(form.reps), weight: optionalNumber(form.weight) }] : [];
      const created = await createWorkout({ name: form.name, duration: optionalNumber(form.duration), date: form.date, exercises });
      setWorkouts((current) => [created, ...current]);
      setForm((current) => ({ ...current, name: "", duration: "", exerciseName: "", sets: "", reps: "", weight: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id) {
    try {
      await deleteWorkout(id);
      setWorkouts((current) => current.filter((workout) => workout._id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  async function findExercises(event) {
    event.preventDefault();
    if (exerciseQuery.trim().length < 2) return;
    setSearchingExercises(true);
    setError("");
    try {
      setExerciseResults(await searchExercises(exerciseQuery.trim()));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSearchingExercises(false);
    }
  }

  return (
    <AppShell>
      <h1 className="mb-1! text-2xl! sm:text-3xl!">Workouts</h1>
      <p className="text-text">Build and track your training sessions.</p>
      {!isSignedIn && <div className="mt-4 rounded-lg border border-accent-border bg-accent-bg p-4 text-sm text-text-h">Explore the workout builder below. Sign in when you save a workout.</div>}
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <section className="mt-6 rounded-lg border border-border bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-lg!">Exercise library</h2><p className="text-sm">Find an exercise from the public wger database.</p></div>
          <form onSubmit={findExercises} className="flex w-full gap-2 sm:w-auto">
            <label htmlFor="exercise-search" className="sr-only">Search exercises</label>
            <input id="exercise-search" required minLength="2" maxLength="100" value={exerciseQuery} onChange={(event) => setExerciseQuery(event.target.value)} placeholder="e.g. squat" className="min-w-0 flex-1 rounded-md border border-border bg-bg px-3 py-2 sm:w-64" />
            <button disabled={searchingExercises} className="rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-60">{searchingExercises ? "Searching…" : "Search"}</button>
          </form>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exerciseResults.map((exercise) => <article key={`${exercise.id}-${exercise.name}`} className="rounded-md border border-border bg-bg p-4"><h3 className="text-sm!">{exercise.name}</h3>{exercise.description && <p className="mt-2 line-clamp-3 text-xs">{exercise.description}</p>}<div className="mt-3 flex flex-wrap gap-3">{exercise.sourceUrl && <a href={exercise.sourceUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-accent">View exercise ↗</a>}<button type="button" onClick={() => update("exerciseName", exercise.name)} className="text-xs font-semibold text-accent">Use exercise</button></div></article>)}
        </div>
        <p className="mt-4 text-xs text-text">Exercise data: wger, CC BY-SA.</p>
      </section>
      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4">
        <label className="text-sm font-medium text-text-h">Workout name<input required maxLength="200" value={form.name} onChange={(event) => update("name", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>
        <label className="text-sm font-medium text-text-h">Duration (min)<input min="0" type="number" value={form.duration} onChange={(event) => update("duration", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>
        <label className="text-sm font-medium text-text-h">Date<input required type="date" value={form.date} onChange={(event) => update("date", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>
        <label className="text-sm font-medium text-text-h">Exercise<input maxLength="120" value={form.exerciseName} onChange={(event) => update("exerciseName", event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" placeholder="Bench press" /></label>
        {["sets", "reps", "weight"].map((field) => <label key={field} className="text-sm font-medium capitalize text-text-h">{field}<input min="0" step={field === "weight" ? "0.1" : "1"} type="number" value={form[field]} onChange={(event) => update(field, event.target.value)} className="mt-1 w-full rounded-md border border-border bg-bg px-3 py-2" /></label>)}
        <button type={isSignedIn ? "submit" : "button"} onClick={isSignedIn ? undefined : openSignIn} disabled={submitting} className="self-end rounded-pill bg-accent px-5 py-2 font-semibold text-accent-ink disabled:opacity-60">{submitting ? "Saving…" : "Add workout"}</button>
      </form>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {workouts.length === 0 ? <p>No workouts yet.</p> : workouts.map((workout) => <article key={workout._id} className="rounded-lg border border-border bg-surface p-5 shadow-sm"><div className="flex justify-between gap-3"><div><h2 className="text-lg!">{workout.name}</h2><p className="text-sm">{new Date(workout.date).toLocaleDateString()} · {workout.duration ?? "—"} min</p></div><button type="button" onClick={() => remove(workout._id)} className="text-sm font-medium text-red-600">Delete</button></div>{workout.exercises?.map((exercise, index) => <p key={`${exercise.name}-${index}`} className="mt-3 text-sm">{exercise.name}: {exercise.sets ?? "—"} × {exercise.reps ?? "—"}, {exercise.weight ?? "—"} kg</p>)}</article>)}
      </div>
    </AppShell>
  );
}
