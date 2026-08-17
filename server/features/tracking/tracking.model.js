import mongoose from "mongoose";

const trackingEntrySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SavedRecipe",
      default: null,
    },
    customTitle: String,
    calories: { type: Number, required: true },
    protein: Number,
    carbs: Number,
    fat: Number,
    loggedDate: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model("TrackingEntry", trackingEntrySchema);
