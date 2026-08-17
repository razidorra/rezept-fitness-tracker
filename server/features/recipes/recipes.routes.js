import express from "express";
import requireAuth from "../../middleware/requireAuth.js";
import { search, save, list, remove } from "./recipes.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/search", search);
router.get("/", list);
router.post("/", save);
router.delete("/:id", remove);

export default router;
