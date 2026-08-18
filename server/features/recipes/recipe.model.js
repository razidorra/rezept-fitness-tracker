import mongoose from "mongoose";

const savedRecipeSchema = new mongoose.Schema(
  {
    user: { type: String, required: true, index: true },
    externalId: { type: String, required: true },
    title: { type: String, required: true },
    imageUrl: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
  },
  { timestamps: true },
);

savedRecipeSchema.index({ user: 1, externalId: 1 }, { unique: true });

export default mongoose.model("SavedRecipe", savedRecipeSchema);
