// API-Aufrufe fürs Workouts-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Backend ist laut server/spec.md (Abschnitt "Workouts") noch 🚧 nicht
// implementiert -- nur das Ordnergerüst server/features/workouts/ existiert.
// Erst backend-seitig fertig bauen, bevor das hier sinnvoll testbar ist.

// TODO: getWorkouts() -> apiRequest("/workouts", { auth: true })
// TODO: createWorkout(workoutData) -> apiRequest("/workouts", { method: "POST", auth: true, body: workoutData })
// TODO: deleteWorkout(id) -> apiRequest(`/workouts/${id}`, { method: "DELETE", auth: true })
