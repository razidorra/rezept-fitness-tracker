import express from "express";
import requireAuth from "../../middleware/requireAuth.js";
import { create, list, remove } from "./tracking.controller.js";
const router = express.Router();

router.use(requireAuth);
router.get("/", list);
router.post("/", create);
router.delete("/:id", remove);

export default router;
