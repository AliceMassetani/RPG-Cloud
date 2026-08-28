package it.unicam.cs.rpgcloud.dto;

import java.util.List;

/**
 * DTO representing the full game state sent to/from the frontend.
 * This is the JSON contract between Angular and Spring Boot.
 */
public record GameStateDTO(
        String sessionId,
        int mapWidth,
        int mapHeight,
        HeroDTO hero,
        List<EntityDTO> entities,
        List<String> combatLog
) {

    public record HeroDTO(
            String name,
            int currentHealth,
            int maxHealth,
            int baseDamage,
            List<ItemDTO> inventory
    ) {}

    public record EntityDTO(
            String type,    // "HERO" or "MONSTER"
            String name,
            int x,
            int y,
            int currentHealth,
            int maxHealth,
            int baseDamage
    ) {}

    public record ItemDTO(
            String type,    // "WEAPON" or "POTION"
            String name,
            int quantity,
            int value       // damage for weapons, healAmount for potions
    ) {}
}
