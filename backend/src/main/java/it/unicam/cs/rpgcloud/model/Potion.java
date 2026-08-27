package it.unicam.cs.rpgcloud.model;

import java.util.Objects;

/**
 * A potion item that restores health to a target character when used.
 */
public class Potion implements Item {

    private final String name;
    private final int healAmount;

    public Potion(String name, int healAmount) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Potion name must not be null or blank.");
        }
        if (healAmount < 0) {
            throw new IllegalArgumentException("Heal amount must not be negative.");
        }
        this.name = name;
        this.healAmount = healAmount;
    }

    @Override
    public void use(GameCharacter target) {
        target.heal(healAmount);
    }

    @Override
    public String getName() {
        return name;
    }

    public int getHealAmount() {
        return healAmount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Potion potion)) return false;
        return Objects.equals(name, potion.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Potion{name='" + name + "', healAmount=" + healAmount + "}";
    }
}
