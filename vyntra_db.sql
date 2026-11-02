
-- ==========================================
-- VYNTRA SOCIAL MEDIA APPLICATION
-- Database: vyntra_db
-- ==========================================

CREATE DATABASE IF NOT EXISTS vyntra_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE vyntra_db;


-- ==========================================
-- 1. USERS TABLE
-- Signup, login and user profiles
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,

    bio VARCHAR(250) DEFAULT NULL,
    profile_image VARCHAR(500) DEFAULT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_name (name)
) ENGINE=InnoDB;


-- ==========================================
-- 2. POSTS TABLE
-- Create, view and delete posts
-- ==========================================

CREATE TABLE IF NOT EXISTS posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,
    caption TEXT DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_posts_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_posts_user_created (user_id, created_at),
    INDEX idx_posts_created (created_at)
) ENGINE=InnoDB;


-- ==========================================
-- 3. LIKES TABLE
-- Like and unlike posts
-- ==========================================

CREATE TABLE IF NOT EXISTS likes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_likes_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_post_like UNIQUE (post_id, user_id),

    INDEX idx_likes_user (user_id)
) ENGINE=InnoDB;


-- ==========================================
-- 4. COMMENTS TABLE
-- Add and delete comments
-- ==========================================

CREATE TABLE IF NOT EXISTS comments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    post_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    comment_text VARCHAR(1000) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_comments_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_comments_post_created (post_id, created_at),
    INDEX idx_comments_user (user_id)
) ENGINE=InnoDB;


-- ==========================================
-- 5. FOLLOWS TABLE
-- Followers and following
-- ==========================================

USE vyntra_db;

CREATE TABLE IF NOT EXISTS follows (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    follower_id INT UNSIGNED NOT NULL,
    following_id INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_follows_follower
        FOREIGN KEY (follower_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_follows_following
        FOREIGN KEY (following_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_follow
        UNIQUE (follower_id, following_id),

    INDEX idx_follows_following (following_id)

) ENGINE=InnoDB;


-- ==========================================
-- 6. SAVED POSTS TABLE (BONUS)
-- Bookmark posts for later
-- ==========================================

CREATE TABLE IF NOT EXISTS saved_posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNSIGNED NOT NULL,
    post_id INT UNSIGNED NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_saved_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_saved_post
        FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_saved_post UNIQUE (user_id, post_id),

    INDEX idx_saved_user_created (user_id, created_at)
) ENGINE=InnoDB;
USE vyntra_db;
delete from users where id=2;
select *from users;

