import express from "express";
import { exercises, foods, meals } from "./catalog.controller.js";

const router = express.Router();

router.get("/foods", foods);
router.get("/exercises", exercises);
router.get("/meals", meals);

export default router;
