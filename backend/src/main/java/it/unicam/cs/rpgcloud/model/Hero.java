package it.unicam.cs.rpgcloud.model;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * A playable hero character controlled by the player.
 * Heroes can carry an inventory of items and use them during gameplay.
 */
public class Hero extends GameCharacter {

    private final Map<Item, Integer> inventory = new HashMap<>();

    public Hero(String name, int maxHealth, int baseDamage) {
        super(name, maxHealth, baseDamage);
    }

    /**
     * Adds the given quantity of an item to this hero's inventory.
     * If the item is already present, the quantities are summed.
     */
    public void addItem(Item item, int quantity) {
        if (item == null) {
            throw new IllegalArgumentException("Item must not be null.");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive.");
        }
        inventory.merge(item, quantity, Integer::sum);
    }

    /**
     * Uses one unit of the given item on the specified target.
     * The item's effect is applied and its quantity is decremented.
     * If the quantity reaches zero the item is removed from the inventory.
     */
    public void useItem(Item item, GameCharacter target) {
        if (item == null) {
            throw new IllegalArgumentException("Item must not be null.");
        }
        if (target == null) {
            throw new IllegalArgumentException("Target must not be null.");
        }

        Integer currentQuantity = inventory.get(item);
        if (currentQuantity == null || currentQuantity <= 0) {
            throw new IllegalStateException("Item not found in inventory: " + item.getName());
        }

        item.use(target);

        int remaining = currentQuantity - 1;
        if (remaining <= 0) {
            inventory.remove(item);
        } else {
            inventory.put(item, remaining);
        }
    }

    /**
     * Returns an unmodifiable view of this hero's inventory.
     */
    public Map<Item, Integer> getInventory() {
        return Collections.unmodifiableMap(inventory);
    }
}
