package it.unicam.cs.rpgcloud.model;

/**
 * Immutable representation of a 2D grid coordinate.
 */
public record Position(int x, int y) {

    /**
     * Returns a new Position translated by the given offsets.
     */
    public Position translate(int dx, int dy) {
        return new Position(x + dx, y + dy);
    }
}
