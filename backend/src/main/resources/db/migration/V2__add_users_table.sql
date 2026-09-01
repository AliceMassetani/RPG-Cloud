-- ============================================================================
-- V2: Add users table and username column to game_sessions
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE game_sessions ADD COLUMN username VARCHAR(50) NOT NULL DEFAULT '';

CREATE INDEX idx_game_sessions_username ON game_sessions(username);
