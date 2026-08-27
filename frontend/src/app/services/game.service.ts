import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameStateDTO, SaveSummaryDTO, Direction } from '../models/game.models';

/**
 * Service that handles all HTTP communication with the Spring Boot backend.
 * In Docker, requests to /api/ are proxied by Nginx to the backend container.
 */
@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly apiUrl = '/api/game';

  constructor(private http: HttpClient) {}

  /** Create a new game session */
  newGame(playerName: string): Observable<GameStateDTO> {
    return this.http.post<GameStateDTO>(`${this.apiUrl}/new`, { playerName });
  }

  /** Get current game state */
  getGameState(sessionId: string): Observable<GameStateDTO> {
    return this.http.get<GameStateDTO>(`${this.apiUrl}/${sessionId}`);
  }

  /** Move the hero */
  move(sessionId: string, direction: Direction): Observable<GameStateDTO> {
    return this.http.post<GameStateDTO>(`${this.apiUrl}/${sessionId}/move`, { direction });
  }

  /** Use an item from inventory */
  useItem(sessionId: string, itemName: string): Observable<GameStateDTO> {
    return this.http.post<GameStateDTO>(`${this.apiUrl}/${sessionId}/use-item`, { itemName });
  }

  /** Save game to database */
  saveGame(sessionId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${sessionId}/save`, {});
  }

  /** Load a saved game */
  loadGame(sessionId: string): Observable<GameStateDTO> {
    return this.http.post<GameStateDTO>(`${this.apiUrl}/${sessionId}/load`, {});
  }

  /** List all saved games */
  listSaves(): Observable<SaveSummaryDTO[]> {
    return this.http.get<SaveSummaryDTO[]>(`${this.apiUrl}/saves`);
  }

  /** Delete a saved game */
  deleteGame(sessionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sessionId}`);
  }
}
