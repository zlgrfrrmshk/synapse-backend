import express from "express";
import { googleAuth, getMe, logout, changeInfo, subscribe, unsubscribe, isSubscribed, getSubscriptions } from "../controllers/authController.js";

const router = express.Router();

// * Google Auth
router.post("/google", googleAuth);

// * Check me
router.get("/me", getMe);

// * Log out
router.post("/logout", logout);

// * Change Profile Info
router.post("/changeinfo", changeInfo);

// * Sub to another user
router.post("/subscribe", subscribe);

// * Unsub another user
router.post("/unsubscribe", unsubscribe);

// * Check is user subscribed
router.get("/issubscribed/:targetId", isSubscribed);

// * Get subs
router.get("/subscriptions", getSubscriptions);

export default router;