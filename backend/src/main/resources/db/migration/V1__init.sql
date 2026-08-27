-- ============================================================================
-- V1: Initial schema — game_sessions table
-- ============================================================================

CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_state JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
