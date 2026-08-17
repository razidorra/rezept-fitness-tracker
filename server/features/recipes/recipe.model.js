import mongoose from "mongoose";

const savedRecipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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

export default mongoose.model("SavedRecipe", savedRecipeSchema);
