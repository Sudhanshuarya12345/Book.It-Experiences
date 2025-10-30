import { Router } from "express";
import { createBooking, validatePromo } from "../controllers/booking.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createBooking));
router.post("/promo/validate", asyncHandler(validatePromo));

export default router;
