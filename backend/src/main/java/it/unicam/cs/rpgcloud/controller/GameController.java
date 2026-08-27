package it.unicam.cs.rpgcloud.controller;

import it.unicam.cs.rpgcloud.dto.*;
import it.unicam.cs.rpgcloud.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * REST controller exposing the game API.
 * All endpoints are under /api/game.
 */
@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    /**
     * POST /api/game/new — Create a new game session.
     */
    @PostMapping("/new")
    public ResponseEntity<GameStateDTO> newGame(@RequestBody NewGameRequest request) {
        GameStateDTO state = gameService.createNewGame(request.playerName());
        return ResponseEntity.status(HttpStatus.CREATED).body(state);
    }

    /**
     * GET /api/game/{sessionId} — Get current game state.
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<GameStateDTO> getGameState(@PathVariable String sessionId) {
        try {
            GameStateDTO state = gameService.getGameState(sessionId);
            return ResponseEntity.ok(state);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/game/{sessionId}/move — Move the hero.
     */
    @PostMapping("/{sessionId}/move")
    public ResponseEntity<GameStateDTO> move(@PathVariable String sessionId,
                                              @RequestBody MoveRequest request) {
        try {
            GameStateDTO state = gameService.moveHero(sessionId, request.direction());
            return ResponseEntity.ok(state);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/game/{sessionId}/use-item — Use an item from inventory.
     */
    @PostMapping("/{sessionId}/use-item")
    public ResponseEntity<GameStateDTO> useItem(@PathVariable String sessionId,
                                                 @RequestBody UseItemRequest request) {
        try {
            GameStateDTO state = gameService.useItem(sessionId, request.itemName());
            return ResponseEntity.ok(state);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/game/{sessionId}/save — Save game to database.
     */
    @PostMapping("/{sessionId}/save")
    public ResponseEntity<Map<String, String>> saveGame(@PathVariable String sessionId) {
        try {
            gameService.saveGame(sessionId);
            return ResponseEntity.ok(Map.of("message", "Game saved successfully"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/game/saves — List all saved games.
     */
    @GetMapping("/saves")
    public ResponseEntity<List<SaveSummaryDTO>> listSaves() {
        return ResponseEntity.ok(gameService.listSaves());
    }

    /**
     * POST /api/game/{sessionId}/load — Load a saved game into memory.
     */
    @PostMapping("/{sessionId}/load")
    public ResponseEntity<GameStateDTO> loadGame(@PathVariable String sessionId) {
        try {
            GameStateDTO state = gameService.loadGame(sessionId);
            return ResponseEntity.ok(state);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/game/{sessionId} — Delete a saved game.
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteGame(@PathVariable String sessionId) {
        gameService.deleteGame(sessionId);
        return ResponseEntity.noContent().build();
    }
}
