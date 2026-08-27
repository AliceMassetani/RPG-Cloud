-- ============================================================================
-- RPG-Cloud Database Initialization
-- ============================================================================

-- Sessioni di gioco (salvataggi)
CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(36) PRIMARY KEY,
    player_name VARCHAR(100) NOT NULL,
    game_state JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
