// Business-Logik fürs Workouts-Feature: Workouts (mit eingebetteten Exercises)
// für einen User anlegen/lesen/löschen.
// Wird von workouts.controller.js aufgerufen.
//
// Analog zu recipes.service.js / tracking.service.js: erst workout.model.js
// bauen (siehe tracking.model.js als Vorlage für den Aufbau, Felder siehe
// server/spec.md), dann hier die Model-Methoden aufrufen.

import Workout from "./workout.model.js";

export function createWorkoutForUser(userId, workoutData) {
  return Workout.create({ ...workoutData, user: userId });
}

export function getWorkoutsForUser(userId) {
  return Workout.find({ user: userId }).sort({ date: -1 });
}

export function deleteWorkout(userId, workoutId) {
  return Workout.findOneAndDelete({ _id: workoutId, user: userId });
}
