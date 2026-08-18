// Steuert eingehende HTTP-Requests fürs Workouts-Feature.
// Validiert Input, ruft workouts.service.js auf, formt die Response.

import * as workoutsService from "./workouts.service.js";
import {
  hasValidOptionalNumbers,
  isNonEmptyString,
  isValidDate,
  isValidObjectId,
} from "../../utils/validation.js";

function validExercises(exercises) {
  return (
    exercises === undefined ||
    (Array.isArray(exercises) &&
      exercises.length <= 50 &&
      exercises.every(
        (exercise) =>
          exercise &&
          typeof exercise === "object" &&
          !Array.isArray(exercise) &&
          isNonEmptyString(exercise.name, 120) &&
          hasValidOptionalNumbers(exercise, ["sets", "reps", "weight"]),
      ))
  );
}

export async function create(req, res) {
  try {
    const { name, duration, date, exercises } = req.body;
    if (!isNonEmptyString(name, 200)) {
      return res.status(400).json({ error: "name ist erforderlich" });
    }
    if (!hasValidOptionalNumbers(req.body, ["duration"]) || !isValidDate(date) || !validExercises(exercises)) {
      return res.status(400).json({ error: "Workout-Daten sind ungültig" });
    }
    const workout = await workoutsService.createWorkoutForUser(req.userId, {
      name: name.trim(),
      duration,
      date,
      exercises,
    });
    res.status(201).json(workout);
  } catch (err) {
    console.error("Workout-Create-Fehler:", err.message);
    res.status(500).json({ error: "Workout konnte nicht erstellt werden" });
  }
}

export async function list(req, res) {
  try {
    res.json(await workoutsService.getWorkoutsForUser(req.userId));
  } catch (err) {
    console.error("Workout-List-Fehler:", err.message);
    res.status(500).json({ error: "Workouts konnten nicht geladen werden" });
  }
}

export async function remove(req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Ungültige Workout-ID" });
    }
    const deleted = await workoutsService.deleteWorkout(req.userId, req.params.id);
    if (!deleted) return res.status(404).json({ error: "Workout nicht gefunden" });
    res.status(204).send();
  } catch (err) {
    console.error("Workout-Delete-Fehler:", err.message);
    res.status(500).json({ error: "Workout konnte nicht gelöscht werden" });
  }
}
