package it.unicam.cs.rpgcloud.service;

import it.unicam.cs.rpgcloud.model.GameCharacter;
import org.springframework.stereotype.Service;

import java.util.Random;

/**
 * Manages combat resolution between heroes and monsters.
 * Ported from the original BattleManager — same logic, same probabilities.
 */
@Service
public class BattleService {

    private static final double MISS_CHANCE = 0.05;
    private static final double CRITICAL_HIT_CHANCE = 0.10;
    private static final double DAMAGE_VARIANCE = 0.20;
    private static final int CRITICAL_MULTIPLIER = 2;

    private final Random random = new Random();

    /**
     * Resolves an attack from the attacker against the defender.
     * Applies miss chance, damage variance, and critical hit logic.
     * Returns a descriptive string of what happened.
     */
    public String performAttack(GameCharacter attacker, GameCharacter defender) {
        String attackerName = attacker.getName();
        String defenderName = defender.getName();

        // Check for miss
        if (random.nextDouble() < MISS_CHANCE) {
            return attackerName + " missed!";
        }

        // Calculate base damage with ±20% variance
        int baseDamage = attacker.getBaseDamage();
        double varianceFactor = 1.0 + (random.nextDouble() * 2 * DAMAGE_VARIANCE - DAMAGE_VARIANCE);
        int finalDamage = (int) Math.round(baseDamage * varianceFactor);

        // Check for critical hit
        boolean isCritical = random.nextDouble() < CRITICAL_HIT_CHANCE;
        if (isCritical) {
            finalDamage *= CRITICAL_MULTIPLIER;
        }

        // Ensure damage is at least 1
        finalDamage = Math.max(1, finalDamage);

        defender.takeDamage(finalDamage);

        if (isCritical) {
            return attackerName + " lands a CRITICAL HIT on " + defenderName
                    + " for " + finalDamage + " damage!";
        }

        return attackerName + " attacks " + defenderName
                + " for " + finalDamage + " damage.";
    }
}
