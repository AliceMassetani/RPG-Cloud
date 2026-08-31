package it.unicam.cs.rpgcloud.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.unicam.cs.rpgcloud.dto.*;
import it.unicam.cs.rpgcloud.dto.GameStateDTO.*;
import it.unicam.cs.rpgcloud.entity.GameSessionEntity;
import it.unicam.cs.rpgcloud.model.*;
import it.unicam.cs.rpgcloud.repository.GameSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

/**
 * Core game service that manages active game sessions on Redis
 * and provides save/load functionality via the database.
 *
 * Active sessions are stored in Redis with a 2-hour TTL (12-Factor: stateless
 * processes).
 * Persistence is triggered only on explicit save by the user.
 */
@Service
public class GameService {

    private static final Logger log = LoggerFactory.getLogger(GameService.class);
    private static final int MAP_SIZE = 10;
    private static final String REDIS_KEY_PREFIX = "rpg:session:";
    private static final Duration SESSION_TTL = Duration.ofHours(2);

    private final BattleService battleService;
    private final GameSessionRepository sessionRepository;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public GameService(BattleService battleService,
            GameSessionRepository sessionRepository,
            ObjectMapper objectMapper,
            StringRedisTemplate redisTemplate) {
        this.battleService = battleService;
        this.sessionRepository = sessionRepository;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    // =========================================================================
    // Session Management
    // =========================================================================

    /**
     * Creates a new game session with a fresh map, hero, and monsters.
     */
    public GameStateDTO createNewGame(String playerName) {
        String sessionId = UUID.randomUUID().toString();

        GameMap map = new GameMap(MAP_SIZE, MAP_SIZE);
        Hero hero = new Hero(playerName, 100, 15);
        map.placeCharacter(hero, new Position(0, 0));

        // Place monsters at fixed positions (same as original project)
        Monster goblin = new Monster("Goblin", 30, 8);
        Monster skeleton = new Monster("Skeleton", 40, 10);
        Monster orc = new Monster("Orc", 50, 12);

        map.placeCharacter(goblin, new Position(3, 2));
        map.placeCharacter(skeleton, new Position(7, 5));
        map.placeCharacter(orc, new Position(5, 8));

        // Place some items on the map
        // (Potions and weapons will be added to the hero's inventory
        // when they step on the tile — future enhancement)

        GameState state = new GameState(map, hero);
        ActiveSession session = new ActiveSession(sessionId, playerName, state);

        saveSessionToRedis(session);
        log.info("New game created: sessionId={}, player={}", sessionId, playerName);

        return toDTO(session);
    }

    /**
     * Gets the current state of an active session.
     */
    public GameStateDTO getGameState(String sessionId) {
        ActiveSession session = getActiveSession(sessionId);
        return toDTO(session);
    }

    // =========================================================================
    // Hero Movement
    // =========================================================================

    /**
     * Moves the hero in the given direction. If a monster occupies the target,
     * combat is resolved automatically.
     */
    public GameStateDTO moveHero(String sessionId, MoveRequest.Direction direction) {
        ActiveSession session = getActiveSession(sessionId);
        GameState state = session.state;
        Hero hero = state.hero();
        GameMap map = state.map();

        if (!hero.isAlive()) {
            session.addLog("The Hero is dead. Game Over!");
            saveSessionToRedis(session);
            return toDTO(session);
        }

        int dx = 0, dy = 0;
        switch (direction) {
            case UP -> dy = -1;
            case DOWN -> dy = 1;
            case LEFT -> dx = -1;
            case RIGHT -> dx = 1;
        }

        Optional<Position> heroPos = map.getCharacterPosition(hero);
        if (heroPos.isEmpty()) {
            return toDTO(session);
        }

        Position target = heroPos.get().translate(dx, dy);

        if (!map.isPositionValid(target)) {
            return toDTO(session); // out of bounds, no move
        }

        Optional<GameCharacter> collision = map.moveCharacter(hero, target);

        if (collision.isPresent() && collision.get() instanceof Monster monster) {
            resolveCombat(session, hero, monster, map);
        }

        saveSessionToRedis(session);
        return toDTO(session);
    }

    /**
     * Resolves combat: hero attacks monster, then monster counter-attacks if alive.
     */
    private void resolveCombat(ActiveSession session, Hero hero, Monster monster, GameMap map) {
        String heroResult = battleService.performAttack(hero, monster);
        session.addLog(heroResult);

        if (!monster.isAlive()) {
            session.addLog(monster.getName() + " has been defeated!");
            map.removeCharacter(monster);

            // Check if all monsters are defeated
            boolean monstersRemain = map.getEntities().values().stream()
                    .anyMatch(c -> c instanceof Monster);
            if (!monstersRemain) {
                session.addLog("🎉 All monsters defeated! You win!");
            }
            return;
        }

        String monsterResult = battleService.performAttack(monster, hero);
        session.addLog(monsterResult);

        if (!hero.isAlive()) {
            session.addLog("💀 The Hero has fallen... Game Over!");
        }
    }

    // =========================================================================
    // Item Usage
    // =========================================================================

    /**
     * Uses an item from the hero's inventory on the hero.
     */
    public GameStateDTO useItem(String sessionId, String itemName) {
        ActiveSession session = getActiveSession(sessionId);
        Hero hero = session.state.hero();

        Optional<Item> item = hero.getInventory().keySet().stream()
                .filter(i -> i.getName().equalsIgnoreCase(itemName))
                .findFirst();

        if (item.isEmpty()) {
            session.addLog("Item not found: " + itemName);
            saveSessionToRedis(session);
            return toDTO(session);
        }

        hero.useItem(item.get(), hero);
        session.addLog("Used " + itemName + ". HP: " + hero.getCurrentHealth() + "/" + hero.getMaxHealth());

        saveSessionToRedis(session);
        return toDTO(session);
    }

    // =========================================================================
    // Persistence (Save / Load)
    // =========================================================================

    /**
     * Saves the current in-memory session to the database.
     */
    public void saveGame(String sessionId) {
        ActiveSession session = getActiveSession(sessionId);

        try {
            String stateJson = objectMapper.writeValueAsString(toDTO(session));

            Optional<GameSessionEntity> existing = sessionRepository.findById(sessionId);
            if (existing.isPresent()) {
                existing.get().setGameState(stateJson);
                sessionRepository.save(existing.get());
            } else {
                GameSessionEntity entity = new GameSessionEntity(sessionId, session.playerName, stateJson);
                sessionRepository.save(entity);
            }

            session.addLog("Game saved successfully.");
            saveSessionToRedis(session);
            log.info("Game saved: sessionId={}", sessionId);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize game state", e);
        }
    }

    /**
     * Loads a saved game from the database into an active Redis session.
     */
    public GameStateDTO loadGame(String sessionId) {
        GameSessionEntity entity = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NoSuchElementException("Save not found: " + sessionId));

        try {
            GameStateDTO dto = objectMapper.readValue(entity.getGameState(), GameStateDTO.class);

            // Reconstruct the model from the DTO
            GameMap map = new GameMap(dto.mapWidth(), dto.mapHeight());
            Hero hero = null;

            for (EntityDTO entityDto : dto.entities()) {
                GameCharacter character;
                if ("HERO".equals(entityDto.type())) {
                    hero = new Hero(entityDto.name(), entityDto.maxHealth(), entityDto.baseDamage());
                    hero.setCurrentHealth(entityDto.currentHealth());
                    character = hero;
                } else {
                    Monster monster = new Monster(entityDto.name(), entityDto.maxHealth(), entityDto.baseDamage());
                    monster.setCurrentHealth(entityDto.currentHealth());
                    character = monster;
                }
                map.placeCharacter(character, new Position(entityDto.x(), entityDto.y()));
            }

            if (hero == null) {
                throw new IllegalStateException("No hero found in saved game state");
            }

            // Restore inventory
            if (dto.hero() != null && dto.hero().inventory() != null) {
                for (ItemDTO itemDto : dto.hero().inventory()) {
                    Item item = "WEAPON".equals(itemDto.type())
                            ? new Weapon(itemDto.name(), itemDto.value())
                            : new Potion(itemDto.name(), itemDto.value());
                    hero.addItem(item, itemDto.quantity());
                }
            }

            GameState state = new GameState(map, hero);
            ActiveSession session = new ActiveSession(sessionId, entity.getPlayerName(), state);
            session.addLog("Game loaded successfully.");

            // Restore combat log
            if (dto.combatLog() != null) {
                dto.combatLog().forEach(session::addLog);
            }

            saveSessionToRedis(session);
            log.info("Game loaded: sessionId={}", sessionId);

            return toDTO(session);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize game state", e);
        }
    }

    /**
     * Lists all saved game sessions.
     */
    public List<SaveSummaryDTO> listSaves() {
        return sessionRepository.findAllByOrderByUpdatedAtDesc().stream()
                .map(e -> new SaveSummaryDTO(e.getId(), e.getPlayerName(), e.getCreatedAt(), e.getUpdatedAt()))
                .toList();
    }

    /**
     * Deletes a saved game session.
     */
    public void deleteGame(String sessionId) {
        sessionRepository.deleteById(sessionId);
        deleteSessionFromRedis(sessionId);
        log.info("Game deleted: sessionId={}", sessionId);
    }

    // =========================================================================
    // Redis helpers
    // =========================================================================

    /**
     * Serializes the active session and stores it in Redis with a TTL.
     */
    private void saveSessionToRedis(ActiveSession session) {
        try {
            String json = objectMapper.writeValueAsString(toDTO(session));
            redisTemplate.opsForValue().set(redisKey(session.sessionId), json, SESSION_TTL);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize session to Redis", e);
        }
    }

    /**
     * Retrieves and deserializes an active session from Redis.
     */
    private ActiveSession getActiveSession(String sessionId) {
        String json = redisTemplate.opsForValue().get(redisKey(sessionId));
        if (json == null) {
            throw new NoSuchElementException("Session not found: " + sessionId);
        }

        try {
            GameStateDTO dto = objectMapper.readValue(json, GameStateDTO.class);

            // Reconstruct model from DTO
            GameMap map = new GameMap(dto.mapWidth(), dto.mapHeight());
            Hero hero = null;

            for (EntityDTO entityDto : dto.entities()) {
                GameCharacter character;
                if ("HERO".equals(entityDto.type())) {
                    hero = new Hero(entityDto.name(), entityDto.maxHealth(), entityDto.baseDamage());
                    hero.setCurrentHealth(entityDto.currentHealth());
                    character = hero;
                } else {
                    Monster monster = new Monster(entityDto.name(), entityDto.maxHealth(), entityDto.baseDamage());
                    monster.setCurrentHealth(entityDto.currentHealth());
                    character = monster;
                }
                map.placeCharacter(character, new Position(entityDto.x(), entityDto.y()));
            }

            if (hero == null) {
                throw new IllegalStateException("No hero found in session data");
            }

            // Restore inventory
            if (dto.hero() != null && dto.hero().inventory() != null) {
                for (ItemDTO itemDto : dto.hero().inventory()) {
                    Item item = "WEAPON".equals(itemDto.type())
                            ? new Weapon(itemDto.name(), itemDto.value())
                            : new Potion(itemDto.name(), itemDto.value());
                    hero.addItem(item, itemDto.quantity());
                }
            }

            GameState state = new GameState(map, hero);
            ActiveSession session = new ActiveSession(sessionId, dto.hero().name(), state);

            // Restore combat log
            if (dto.combatLog() != null) {
                dto.combatLog().forEach(session::addLog);
            }

            return session;
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize session from Redis", e);
        }
    }

    /**
     * Deletes an active session from Redis.
     */
    private void deleteSessionFromRedis(String sessionId) {
        redisTemplate.delete(redisKey(sessionId));
    }

    private String redisKey(String sessionId) {
        return REDIS_KEY_PREFIX + sessionId;
    }

    // =========================================================================
    // DTO conversion
    // =========================================================================

    /**
     * Converts the in-memory game state to a DTO for JSON serialization.
     */
    private GameStateDTO toDTO(ActiveSession session) {
        GameState state = session.state;
        Hero hero = state.hero();
        GameMap map = state.map();

        // Build entity list
        List<EntityDTO> entities = new ArrayList<>();
        for (Map.Entry<Position, GameCharacter> entry : map.getEntities().entrySet()) {
            Position pos = entry.getKey();
            GameCharacter c = entry.getValue();
            String type = (c instanceof Hero) ? "HERO" : "MONSTER";
            entities.add(new EntityDTO(
                    type, c.getName(), pos.x(), pos.y(),
                    c.getCurrentHealth(), c.getMaxHealth(), c.getBaseDamage()));
        }

        // Build inventory list
        List<ItemDTO> inventoryItems = new ArrayList<>();
        for (Map.Entry<Item, Integer> entry : hero.getInventory().entrySet()) {
            Item item = entry.getKey();
            String type;
            int value;
            if (item instanceof Weapon w) {
                type = "WEAPON";
                value = w.getDamage();
            } else if (item instanceof Potion p) {
                type = "POTION";
                value = p.getHealAmount();
            } else {
                type = "UNKNOWN";
                value = 0;
            }
            inventoryItems.add(new ItemDTO(type, item.getName(), entry.getValue(), value));
        }

        HeroDTO heroDto = new HeroDTO(
                hero.getName(), hero.getCurrentHealth(), hero.getMaxHealth(),
                hero.getBaseDamage(), inventoryItems);

        return new GameStateDTO(
                session.sessionId, map.getWidth(), map.getHeight(),
                heroDto, entities, session.combatLog);
    }

    // =========================================================================
    // Inner class for active session tracking
    // =========================================================================

    private static class ActiveSession {
        final String sessionId;
        final String playerName;
        GameState state;
        final List<String> combatLog = new ArrayList<>();

        ActiveSession(String sessionId, String playerName, GameState state) {
            this.sessionId = sessionId;
            this.playerName = playerName;
            this.state = state;
        }

        void addLog(String message) {
            combatLog.add(message);
        }
    }
}
