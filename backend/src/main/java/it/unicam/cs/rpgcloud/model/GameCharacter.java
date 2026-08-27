package it.unicam.cs.rpgcloud.model;

/**
 * Abstract base class representing a living entity in the RPG world.
 * Every character has a name, a maximum health pool, a current health value,
 * and a base damage stat. Health is guaranteed to stay within the
 * range [0, maxHealth].
 */
public abstract class GameCharacter {

    private final String name;
    private final int maxHealth;
    private int currentHealth;
    private final int baseDamage;

    protected GameCharacter(String name, int maxHealth, int baseDamage) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Name must not be null or blank.");
        }
        if (maxHealth <= 0) {
            throw new IllegalArgumentException("Max health must be positive.");
        }
        if (baseDamage < 0) {
            throw new IllegalArgumentException("Base damage must not be negative.");
        }
        this.name = name;
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.baseDamage = baseDamage;
    }

    /**
     * Reduces this character's current health by the specified amount.
     * The resulting health is clamped so it never drops below zero.
     */
    public void takeDamage(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Damage amount must not be negative.");
        }
        this.currentHealth = Math.max(0, this.currentHealth - amount);
    }

    /**
     * Returns true if this character is still alive.
     */
    public boolean isAlive() {
        return this.currentHealth > 0;
    }

    /**
     * Restores health by the specified amount.
     * The resulting health is clamped so it never exceeds maxHealth.
     */
    public void heal(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Heal amount must not be negative.");
        }
        this.currentHealth = Math.min(maxHealth, this.currentHealth + amount);
    }

    /**
     * Sets current health directly. Used when restoring game state from DB.
     */
    public void setCurrentHealth(int currentHealth) {
        this.currentHealth = Math.max(0, Math.min(maxHealth, currentHealth));
    }

    public String getName() {
        return name;
    }

    public int getMaxHealth() {
        return maxHealth;
    }

    public int getCurrentHealth() {
        return currentHealth;
    }

    public int getBaseDamage() {
        return baseDamage;
    }
}
