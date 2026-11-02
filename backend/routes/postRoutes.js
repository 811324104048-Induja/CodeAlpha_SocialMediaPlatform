
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createPost,
    getHomeFeed,
    getExplorePosts,
    deletePost,
    getSpotlight
} = require("../controllers/postController");

// All post routes require login
router.use(verifyToken);

// Create post
router.post("/", createPost);

// Home feed
router.get("/feed", getHomeFeed);

// Explore
router.get("/explore", getExplorePosts);

// Vyntra Spotlight
router.get("/spotlight", getSpotlight);

// Delete post
router.delete("/:id", deletePost);

module.exports = router;
