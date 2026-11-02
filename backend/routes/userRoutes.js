
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile,
    searchUsers,
    getFollowers,
    getFollowing
} = require("../controllers/userController");

// Search users
router.get("/search", verifyToken, searchUsers);

// View profile
router.get("/:id", verifyToken, getProfile);

// Update logged-in user's profile
router.put("/profile/update", verifyToken, updateProfile);

// Followers list
router.get("/:id/followers", verifyToken, getFollowers);

// Following list
router.get("/:id/following", verifyToken, getFollowing);

module.exports = router;
