import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, min: 0 },
    reps: { type: Number, min: 0 },
    weight: { type: Number, min: 0 },
  },
  { _id: false },
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    duration: { type: Number, min: 0 },
    date: { type: Date, default: Date.now },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Workout", workoutSchema);
