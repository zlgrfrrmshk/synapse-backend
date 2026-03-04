import express from "express";
import {getFeed} from "../controllers/feedController.js";

const router = express.Router();

// * Get feed
router.get("/", getFeed);

export default router;