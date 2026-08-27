package it.unicam.cs.rpgcloud.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/**
 * JPA entity representing a saved game session in the database.
 * The game_state column stores the full game state as a JSON string.
 */
@Entity
@Table(name = "game_sessions")
public class GameSessionEntity {

    @Id
    @Column(nullable = false, length = 36)
    private String id;

    @Column(name = "player_name", nullable = false, length = 100)
    private String playerName;

    @Column(name = "game_state", nullable = false, columnDefinition = "JSON")
    private String gameState;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    protected GameSessionEntity() {
        // JPA requires a no-arg constructor
    }

    public GameSessionEntity(String id, String playerName, String gameState) {
        this.id = id;
        this.playerName = playerName;
        this.gameState = gameState;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getGameState() {
        return gameState;
    }

    public void setGameState(String gameState) {
        this.gameState = gameState;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
