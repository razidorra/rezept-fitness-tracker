import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./features/auth/auth.routes.js";
import recipesRoutes from "./features/recipes/recipes.routes.js";
import trackingRoutes from "./features/tracking/tracking.routes.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/tracking", trackingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
