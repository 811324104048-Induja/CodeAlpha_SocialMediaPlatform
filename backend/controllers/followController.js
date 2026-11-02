
const db = require("../config/db");

// FOLLOW USER
exports.followUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = Number(req.params.userId);

        if (!Number.isInteger(followingId) || followingId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (followerId === followingId) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        const [users] = await db.query(
            "SELECT id FROM users WHERE id = ?",
            [followingId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await db.query(
            `INSERT IGNORE INTO follows (follower_id, following_id)
             VALUES (?, ?)`,
            [followerId, followingId]
        );

        res.json({
            message: "User followed successfully"
        });

    } catch (error) {
        console.error("Follow error:", error);

        res.status(500).json({
            message: "Unable to follow user"
        });
    }
};


// UNFOLLOW USER
exports.unfollowUser = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = Number(req.params.userId);

        const [result] = await db.query(
            `DELETE FROM follows
             WHERE follower_id = ? AND following_id = ?`,
            [followerId, followingId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "You are not following this user"
            });
        }

        res.json({
            message: "User unfollowed successfully"
        });

    } catch (error) {
        console.error("Unfollow error:", error);

        res.status(500).json({
            message: "Unable to unfollow user"
        });
    }
};


// CHECK FOLLOW STATUS
exports.checkFollowStatus = async (req, res) => {
    try {
        const followerId = req.user.id;
        const followingId = Number(req.params.userId);

        const [rows] = await db.query(
            `SELECT id FROM follows
             WHERE follower_id = ? AND following_id = ?`,
            [followerId, followingId]
        );

        res.json({
            isFollowing: rows.length > 0
        });

    } catch (error) {
        console.error("Follow status error:", error);

        res.status(500).json({
            message: "Unable to check follow status"
        });
    }
};
