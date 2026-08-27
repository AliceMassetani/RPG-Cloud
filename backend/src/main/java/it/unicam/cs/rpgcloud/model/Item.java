package it.unicam.cs.rpgcloud.model;

/**
 * Represents a usable item in the RPG world.
 * Each item can be applied to a target character.
 */
public interface Item {

    /**
     * Applies this item's effect to the given target.
     */
    void use(GameCharacter target);

    /**
     * Returns the display name of this item.
     */
    String getName();
}
