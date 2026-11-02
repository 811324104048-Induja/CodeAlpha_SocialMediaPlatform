
const db = require("../config/db");

// ADD COMMENT
exports.addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.postId;
        const { comment_text } = req.body;

        if (!comment_text || !comment_text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const [posts] = await db.query(
            "SELECT id FROM posts WHERE id = ?",
            [postId]
        );

        if (posts.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const [result] = await db.query(
            `INSERT INTO comments (post_id, user_id, comment_text)
             VALUES (?, ?, ?)`,
            [postId, userId, comment_text.trim()]
        );

        res.status(201).json({
            message: "Comment added successfully",
            commentId: result.insertId
        });

    } catch (error) {
        console.error("Add comment error:", error);

        res.status(500).json({
            message: "Unable to add comment"
        });
    }
};


// GET COMMENTS
exports.getComments = async (req, res) => {
    try {
        const postId = req.params.postId;

        const [comments] = await db.query(
            `SELECT
                c.id,
                c.post_id,
                c.user_id,
                c.comment_text,
                c.created_at,
                u.name,
                u.username,
                u.profile_image
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = ?
             ORDER BY c.created_at ASC`,
            [postId]
        );

        res.json({
            comments
        });

    } catch (error) {
        console.error("Get comments error:", error);

        res.status(500).json({
            message: "Unable to fetch comments"
        });
    }
};


// DELETE OWN COMMENT
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;

        const [result] = await db.query(
            "DELETE FROM comments WHERE id = ? AND user_id = ?",
            [commentId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Comment not found or you are not the owner"
            });
        }

        res.json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Delete comment error:", error);

        res.status(500).json({
            message: "Unable to delete comment"
        });
    }
};
