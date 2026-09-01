package it.unicam.cs.rpgcloud.dto;

/**
 * Request body for login and register endpoints.
 */
public record AuthRequest(String username, String password) {

    public AuthRequest {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username must not be null or blank.");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password must not be null or blank.");
        }
    }
}
