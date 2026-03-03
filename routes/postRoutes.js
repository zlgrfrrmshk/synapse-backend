import express from "express";
import { createPost, deletePost, likePost, unlikePost, updatePost, getPost, isLiked } from "../controllers/postController.js";
import multer from "../utils/multer.js";

const router = express.Router();

// * Get a post
router.get("/get/:postId", getPost);

// * Create a post
router.post("/create", multer.single('photo'), createPost);

// * Update a post
router.put("/update/:postId", updatePost);

// * Delete a post
router.delete("/delete/:postId", deletePost);

// * Like a post
router.post("/like/:postId", likePost);

// * Unlike a post
router.post("/unlike/:postId", unlikePost);

// * Check is a post liked
router.get('/isliked/:postId', isLiked)

export default router;