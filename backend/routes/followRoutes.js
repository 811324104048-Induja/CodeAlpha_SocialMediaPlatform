
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    followUser,
    unfollowUser,
    checkFollowStatus
} = require("../controllers/followController");

router.use(verifyToken);

// Follow
router.post("/:userId", followUser);

// Unfollow
router.delete("/:userId", unfollowUser);

// Check follow status
router.get("/:userId/status", checkFollowStatus);

module.exports = router;
