package it.unicam.cs.rpgcloud.model;

/**
 * Container for the full state of a game session.
 * Holds the map (with all entity positions) and a reference to the hero.
 */
public record GameState(GameMap map, Hero hero) {

    public GameState {
        if (map == null) {
            throw new IllegalArgumentException("Map must not be null.");
        }
        if (hero == null) {
            throw new IllegalArgumentException("Hero must not be null.");
        }
    }
}
