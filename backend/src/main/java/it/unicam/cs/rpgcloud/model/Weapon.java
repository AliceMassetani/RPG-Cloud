package it.unicam.cs.rpgcloud.model;

import java.util.Objects;

/**
 * A weapon item that deals damage to a target character when used.
 */
public class Weapon implements Item {

    private final String name;
    private final int damage;

    public Weapon(String name, int damage) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Weapon name must not be null or blank.");
        }
        if (damage < 0) {
            throw new IllegalArgumentException("Weapon damage must not be negative.");
        }
        this.name = name;
        this.damage = damage;
    }

    @Override
    public void use(GameCharacter target) {
        target.takeDamage(damage);
    }

    @Override
    public String getName() {
        return name;
    }

    public int getDamage() {
        return damage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Weapon weapon)) return false;
        return Objects.equals(name, weapon.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Weapon{name='" + name + "', damage=" + damage + "}";
    }
}
