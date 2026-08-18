import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";
import recipesRoutes from "./features/recipes/recipes.routes.js";
import trackingRoutes from "./features/tracking/tracking.routes.js";
import workoutsRoutes from "./features/workouts/workouts.routes.js";
import catalogRoutes from "./features/catalog/catalog.routes.js";

export function health(req, res) {
  const database = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(database === "connected" || process.env.NODE_ENV === "test" ? 200 : 503).json({
    status: database === "connected" ? "ok" : "degraded",
    database,
  });
}

export function notFound(req, res) {
  res.status(404).json({ error: "Endpunkt nicht gefunden" });
}

export function createApp() {
  const app = express();
  const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  app.use(clerkMiddleware({ authorizedParties: allowedOrigins }));
  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: "100kb" }));
  app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method) && (!req.body || typeof req.body !== "object" || Array.isArray(req.body))) {
      return res.status(400).json({ error: "JSON-Body muss ein Objekt sein" });
    }
    next();
  });

  app.get("/api/health", health);

  app.use("/api/catalog", catalogRoutes);
  app.use("/api/recipes", recipesRoutes);
  app.use("/api/tracking", trackingRoutes);
  app.use("/api/workouts", workoutsRoutes);

  app.use(notFound);
  app.use((err, req, res, next) => {
    void next;
    console.error("Unbehandelter Serverfehler:", err.message);
    res.status(500).json({ error: "Interner Serverfehler" });
  });

  return app;
}
