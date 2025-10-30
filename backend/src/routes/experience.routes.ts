import { Router } from "express";
import { getAllExperiences, getExperienceById } from "../controllers/experience.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getAllExperiences));
router.get("/:id", asyncHandler(getExperienceById));

export default router;
