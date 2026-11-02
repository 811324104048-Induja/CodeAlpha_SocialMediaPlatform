
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    addComment,
    getComments,
    deleteComment
} = require("../controllers/commentController");

router.use(verifyToken);

// Add comment to a post
router.post("/:postId", addComment);

// View comments of a post
router.get("/:postId", getComments);

// Delete own comment
router.delete("/:commentId", deleteComment);

module.exports = router;
