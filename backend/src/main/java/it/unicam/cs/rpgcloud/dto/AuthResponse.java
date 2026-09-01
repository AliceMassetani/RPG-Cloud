package it.unicam.cs.rpgcloud.dto;

/**
 * Response body containing the JWT token and username.
 */
public record AuthResponse(String token, String username) {}
