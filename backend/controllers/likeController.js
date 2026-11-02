
const db = require("../config/db");

// LIKE POST
exports.likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        const [posts] = await db.query(
            "SELECT id FROM posts WHERE id = ?",
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        await db.query(
            `INSERT IGNORE INTO likes (post_id, user_id)
             VALUES (?, ?)`,
            [postId, userId]
        );

        res.json({
            message: "Post liked successfully"
        });

    } catch (error) {
        console.error("Like error:", error);

        res.status(500).json({
            message: "Unable to like post"
        });
    }
};


// UNLIKE POST
exports.unlikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;

        await db.query(
            "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
            [postId, userId]
        );

        res.json({
            message: "Post unliked successfully"
        });

    } catch (error) {
        console.error("Unlike error:", error);

        res.status(500).json({
            message: "Unable to unlike post"
        });
    }
};


// GET USERS WHO LIKED A POST
exports.getPostLikes = async (req, res) => {
    try {
        const postId = req.params.postId;

        const [users] = await db.query(
            `SELECT u.id, u.name, u.username, u.profile_image
             FROM likes l
             JOIN users u ON l.user_id = u.id
             WHERE l.post_id = ?
             ORDER BY l.created_at DESC`,
            [postId]
        );

        res.json({
            likes: users,
            totalLikes: users.length
        });

    } catch (error) {
        console.error("Get likes error:", error);

        res.status(500).json({
            message: "Unable to fetch likes"
        });
    }
};
