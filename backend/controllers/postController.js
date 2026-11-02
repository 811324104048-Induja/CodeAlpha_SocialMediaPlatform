
const db = require("../config/db");

// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const { caption, image_url } = req.body;
        const userId = req.user.id;

        if (!image_url || !image_url.trim()) {
            return res.status(400).json({
                message: "Post image URL is required"
            });
        }

        const [result] = await db.query(
            `INSERT INTO posts (user_id, caption, image_url)
             VALUES (?, ?, ?)`,
            [userId, caption || "", image_url.trim()]
        );

        res.status(201).json({
            message: "Post created successfully",
            postId: result.insertId
        });

    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            message: "Unable to create post"
        });
    }
};


// HOME FEED
exports.getHomeFeed = async (req, res) => {
    try {
        const userId = req.user.id;

        const [posts] = await db.query(
            `SELECT
                p.id, p.user_id, p.caption, p.image_url, p.created_at,
                u.name, u.username, u.profile_image,

                (SELECT COUNT(*) FROM likes l
                 WHERE l.post_id = p.id) AS likes_count,

                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.id) AS comments_count,

                EXISTS(
                    SELECT 1 FROM likes l
                    WHERE l.post_id = p.id AND l.user_id = ?
                ) AS liked_by_me

             FROM posts p
             JOIN users u ON p.user_id = u.id

             WHERE p.user_id = ?
                OR p.user_id IN (
                    SELECT following_id
                    FROM follows
                    WHERE follower_id = ?
                )

             ORDER BY p.created_at DESC`,
            [userId, userId, userId]
        );

        res.json({
            posts
        });

    } catch (error) {
        console.error("Home feed error:", error);

        res.status(500).json({
            message: "Unable to load home feed"
        });
    }
};


// EXPLORE POSTS
exports.getExplorePosts = async (req, res) => {
    try {
        const userId = req.user.id;

        const [posts] = await db.query(
            `SELECT
                p.id, p.user_id, p.caption, p.image_url, p.created_at,
                u.name, u.username, u.profile_image,

                (SELECT COUNT(*) FROM likes l
                 WHERE l.post_id = p.id) AS likes_count,

                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.id) AS comments_count,

                EXISTS(
                    SELECT 1 FROM likes l
                    WHERE l.post_id = p.id AND l.user_id = ?
                ) AS liked_by_me

             FROM posts p
             JOIN users u ON p.user_id = u.id
             ORDER BY p.created_at DESC
             LIMIT 50`,
            [userId]
        );

        res.json({
            posts
        });

    } catch (error) {
        console.error("Explore error:", error);

        res.status(500).json({
            message: "Unable to load explore posts"
        });
    }
};


// DELETE POST
exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        const [result] = await db.query(
            "DELETE FROM posts WHERE id = ? AND user_id = ?",
            [postId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Post not found or you are not the owner"
            });
        }

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            message: "Unable to delete post"
        });
    }
};


// VYNTRA SPOTLIGHT
exports.getSpotlight = async (req, res) => {
    try {
        const userId = req.user.id;

        const [posts] = await db.query(
            `SELECT
                p.id, p.user_id, p.caption, p.image_url, p.created_at,
                u.name, u.username, u.profile_image,

                (SELECT COUNT(*) FROM likes l
                 WHERE l.post_id = p.id) AS likes_count,

                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.id) AS comments_count,

                EXISTS(
                    SELECT 1 FROM likes l
                    WHERE l.post_id = p.id AND l.user_id = ?
                ) AS liked_by_me

             FROM posts p
             JOIN users u ON p.user_id = u.id

             ORDER BY
                (SELECT COUNT(*) FROM likes l
                 WHERE l.post_id = p.id) * 2
                +
                (SELECT COUNT(*) FROM comments c
                 WHERE c.post_id = p.id) DESC,
                p.created_at DESC

             LIMIT 20`,
            [userId]
        );

        res.json({
            message: "Vyntra Spotlight posts",
            posts
        });

    } catch (error) {
        console.error("Spotlight error:", error);

        res.status(500).json({
            message: "Unable to load Spotlight"
        });
    }
};
