package it.unicam.cs.rpgcloud.dto;

import java.time.LocalDateTime;

/**
 * Summary of a saved game session, used in the saves list.
 */
public record SaveSummaryDTO(
        String sessionId,
        String playerName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
