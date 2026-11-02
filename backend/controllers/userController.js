
const db = require("../config/db");

// GET USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await db.query(
            `SELECT id, name, username, email, bio,
                    profile_image, created_at
             FROM users WHERE id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const [stats] = await db.query(
            `SELECT
                (SELECT COUNT(*) FROM posts WHERE user_id = ?) AS posts_count,
                (SELECT COUNT(*) FROM follows WHERE following_id = ?) AS followers_count,
                (SELECT COUNT(*) FROM follows WHERE follower_id = ?) AS following_count`,
            [userId, userId, userId]
        );

        const [posts] = await db.query(
            `SELECT p.*,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count
             FROM posts p
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC`,
            [userId]
        );

        res.json({
            user: users[0],
            stats: stats[0],
            posts
        });

    } catch (error) {
        console.error("Profile error:", error);

        res.status(500).json({
            message: "Unable to fetch profile"
        });
    }
};


// UPDATE MY PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, profile_image } = req.body;
        const userId = req.user.id;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        await db.query(
            `UPDATE users
             SET name = ?, bio = ?, profile_image = ?
             WHERE id = ?`,
            [
                name.trim(),
                bio || null,
                profile_image || null,
                userId
            ]
        );

        res.json({
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Profile update failed"
        });
    }
};


// SEARCH USERS
exports.searchUsers = async (req, res) => {
    try {
        const search = req.query.q || "";

        if (!search.trim()) {
            return res.json({
                users: []
            });
        }

        const [users] = await db.query(
            `SELECT id, name, username, profile_image, bio
             FROM users
             WHERE username LIKE ? OR name LIKE ?
             LIMIT 20`,
            [`%${search.trim()}%`, `%${search.trim()}%`]
        );

        res.json({
            users
        });

    } catch (error) {
        console.error("Search users error:", error);

        res.status(500).json({
            message: "User search failed"
        });
    }
};


// GET FOLLOWERS
exports.getFollowers = async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await db.query(
            `SELECT u.id, u.name, u.username, u.profile_image
             FROM follows f
             JOIN users u ON f.follower_id = u.id
             WHERE f.following_id = ?
             ORDER BY f.created_at DESC`,
            [userId]
        );

        res.json({
            followers: users
        });

    } catch (error) {
        console.error("Followers error:", error);

        res.status(500).json({
            message: "Unable to fetch followers"
        });
    }
};


// GET FOLLOWING
exports.getFollowing = async (req, res) => {
    try {
        const userId = req.params.id;

        const [users] = await db.query(
            `SELECT u.id, u.name, u.username, u.profile_image
             FROM follows f
             JOIN users u ON f.following_id = u.id
             WHERE f.follower_id = ?
             ORDER BY f.created_at DESC`,
            [userId]
        );

        res.json({
            following: users
        });

    } catch (error) {
        console.error("Following error:", error);

        res.status(500).json({
            message: "Unable to fetch following list"
        });
    }
};
