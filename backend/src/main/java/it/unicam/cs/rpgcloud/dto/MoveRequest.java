package it.unicam.cs.rpgcloud.dto;

/**
 * Request body for moving the hero on the map.
 */
public record MoveRequest(Direction direction) {

    public enum Direction {
        UP, DOWN, LEFT, RIGHT
    }
}
