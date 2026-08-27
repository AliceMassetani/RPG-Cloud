package it.unicam.cs.rpgcloud.model;

/**
 * A hostile monster character encountered during gameplay.
 */
public class Monster extends GameCharacter {

    public Monster(String name, int maxHealth, int baseDamage) {
        super(name, maxHealth, baseDamage);
    }
}
