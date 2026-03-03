import express from "express";
import { googleAuth, getMe, logout, changeInfo, subscribe, unsubscribe, isSubscribed, getSubscriptions, changeAvatar } from "../controllers/authController.js";
import multer from "../utils/multer.js";

const router = express.Router();

// * Google Auth
router.post("/google", googleAuth);

// * Check me
router.get("/me", getMe);

// * Log out
router.post("/logout", logout);

// * Change Profile Info
router.post("/changeinfo", changeInfo);

// * Change Profile Avatar
router.post("/changeavatar", multer.single('avatar'), changeAvatar);

// * Sub to another user
router.post("/subscribe", subscribe);

// * Unsub another user
router.post("/unsubscribe", unsubscribe);

// * Check is user subscribed
router.get("/issubscribed/:targetId", isSubscribed);

// * Get subs
router.get("/subscriptions", getSubscriptions);

export default router;