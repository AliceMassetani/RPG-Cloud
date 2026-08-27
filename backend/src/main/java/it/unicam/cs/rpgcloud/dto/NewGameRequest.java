package it.unicam.cs.rpgcloud.dto;

/**
 * Request body for creating a new game session.
 */
public record NewGameRequest(String playerName) {

    public NewGameRequest {
        if (playerName == null || playerName.isBlank()) {
            throw new IllegalArgumentException("Player name must not be null or blank.");
        }
    }
}
