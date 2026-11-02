
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    likePost,
    unlikePost,
    getPostLikes
} = require("../controllers/likeController");

router.use(verifyToken);

// Like
router.post("/:postId", likePost);

// Unlike
router.delete("/:postId", unlikePost);

// Get likes
router.get("/:postId", getPostLikes);

module.exports = router;
