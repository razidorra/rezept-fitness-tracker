// API-Aufrufe fürs Workouts-Feature. Nutzt apiRequest() aus shared/api/apiClient.js.
// Alle Endpunkte brauchen Auth -- also { auth: true } mitgeben.
//
// Das Backend stellt dafür geschützte CRUD-Endpunkte bereit.

import { apiRequest } from "../../../shared/api/apiClient.js";

export function getWorkouts() {
  return apiRequest("/workouts", { auth: true });
}

export function createWorkout(workoutData) {
  return apiRequest("/workouts", { method: "POST", auth: true, body: workoutData });
}

export function deleteWorkout(id) {
  return apiRequest(`/workouts/${encodeURIComponent(id)}`, { method: "DELETE", auth: true });
}
