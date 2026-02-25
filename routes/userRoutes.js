import express from "express";
import { getUser } from "../controllers/userController.js";

const router = express.Router();

// * Get user
router.get("/get/:userid", getUser);

export default router;