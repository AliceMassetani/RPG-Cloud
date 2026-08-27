package it.unicam.cs.rpgcloud.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Represents a 2D grid map for the RPG world.
 * Tracks entity positions using a Map and enforces bounds checking
 * and collision detection on movement.
 */
public class GameMap {

    private final int width;
    private final int height;
    private final Map<Position, GameCharacter> entities = new HashMap<>();

    public GameMap(int width, int height) {
        if (width <= 0 || height <= 0) {
            throw new IllegalArgumentException("Map dimensions must be positive.");
        }
        this.width = width;
        this.height = height;
    }

    /**
     * Returns true if the position is within the map bounds.
     */
    public boolean isPositionValid(Position position) {
        if (position == null) {
            return false;
        }
        return position.x() >= 0 && position.x() < width
                && position.y() >= 0 && position.y() < height;
    }

    /**
     * Places a character at the given position.
     *
     * @return true if the character was placed, false if the position is invalid or occupied
     */
    public boolean placeCharacter(GameCharacter character, Position position) {
        if (character == null || position == null) {
            throw new IllegalArgumentException("Character and position must not be null.");
        }
        if (!isPositionValid(position)) {
            return false;
        }
        if (entities.containsKey(position)) {
            return false;
        }
        entities.put(position, character);
        return true;
    }

    /**
     * Moves a character to a new position.
     * Returns the occupant if there is a collision, empty Optional if move succeeded,
     * or null if the position is out of bounds.
     */
    public Optional<GameCharacter> moveCharacter(GameCharacter character, Position newPosition) {
        if (character == null || newPosition == null) {
            throw new IllegalArgumentException("Character and position must not be null.");
        }
        if (!isPositionValid(newPosition)) {
            return Optional.empty(); // out of bounds — no move
        }

        GameCharacter occupant = entities.get(newPosition);
        if (occupant != null) {
            return Optional.of(occupant); // collision — return the occupant
        }

        // Remove character from its current position
        entities.values().remove(character);

        // Place at the new position
        entities.put(newPosition, character);
        return Optional.empty(); // moved successfully
    }

    /**
     * Returns the character at the given position, if any.
     */
    public Optional<GameCharacter> getCharacterAt(Position position) {
        return Optional.ofNullable(entities.get(position));
    }

    /**
     * Returns the position of the given character, if present on the map.
     */
    public Optional<Position> getCharacterPosition(GameCharacter character) {
        return entities.entrySet().stream()
                .filter(entry -> entry.getValue().equals(character))
                .map(Map.Entry::getKey)
                .findFirst();
    }

    /**
     * Removes a character from the map (e.g. after defeat).
     */
    public void removeCharacter(GameCharacter character) {
        entities.values().remove(character);
    }

    /**
     * Returns an unmodifiable view of all entities on the map.
     */
    public Map<Position, GameCharacter> getEntities() {
        return Collections.unmodifiableMap(entities);
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }
}
