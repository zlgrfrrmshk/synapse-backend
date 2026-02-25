import express from "express";
import { googleAuth, getMe, logout, changeInfo } from "../controllers/authController.js";

const router = express.Router();

// * Google Auth
router.post("/google", googleAuth);

// * Check me
router.get("/me", getMe);

// * Log out
router.post("/logout", logout);

// * Change Profile Info
router.post("/changeinfo", changeInfo);

export default router;