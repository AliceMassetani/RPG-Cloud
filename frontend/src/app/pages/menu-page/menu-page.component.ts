import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { SaveSummaryDTO } from '../../models/game.models';

/**
 * Main menu page: start a new game or load a saved one.
 */
@Component({
  selector: 'app-menu-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="menu-container">
      <div class="menu-card">
        <h1 class="title">⚔️ RPG Cloud</h1>
        <p class="subtitle">A Rogue-like Adventure</p>

        <!-- New Game -->
        <div class="section">
          <input
            type="text"
            [(ngModel)]="playerName"
            placeholder="Enter your hero name..."
            class="name-input"
            (keydown.enter)="startNewGame()"
          />
          <button class="btn btn-primary" (click)="startNewGame()" [disabled]="!playerName.trim()">
            🎮 New Game
          </button>
        </div>

        <!-- Saved Games -->
        <div class="section">
          <h2 class="section-title">📂 Saved Games</h2>
          <button class="btn btn-secondary btn-sm" (click)="loadSavesList()">
            🔄 Refresh
          </button>

          <div class="saves-list">
            @for (save of saves; track save.sessionId) {
              <div class="save-row">
                <div class="save-info">
                  <span class="save-name">{{ save.playerName }}</span>
                  <span class="save-date">{{ save.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <div class="save-actions">
                  <button class="btn btn-primary btn-sm" (click)="loadSave(save.sessionId)">
                    ▶ Load
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="deleteSave(save.sessionId)">
                    🗑
                  </button>
                </div>
              </div>
            }
            @empty {
              <p class="empty-text">No saved games found.</p>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .menu-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      padding: 20px;
    }

    .menu-card {
      background: rgba(26, 26, 46, 0.9);
      border: 1px solid #2d2d44;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    }

    .title {
      text-align: center;
      color: #e0e0e0;
      font-size: 36px;
      margin: 0;
      font-weight: 800;
      background: linear-gradient(135deg, #FFD700, #FFA000);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      text-align: center;
      color: #888;
      font-size: 14px;
      margin: 4px 0 24px 0;
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .section {
      margin-bottom: 24px;
    }

    .section-title {
      color: #ccc;
      font-size: 16px;
      margin: 0 0 12px 0;
      font-weight: 600;
    }

    .name-input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid #3d3d5c;
      border-radius: 10px;
      color: #e0e0e0;
      font-size: 16px;
      margin-bottom: 12px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .name-input:focus {
      border-color: #FFD700;
    }

    .name-input::placeholder {
      color: #666;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      width: 100%;
    }

    .btn-sm {
      padding: 6px 14px;
      font-size: 13px;
      width: auto;
      border-radius: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #FFD700, #FFA000);
      color: #1a1a2e;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
    }

    .btn-primary:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #ccc;
      margin-bottom: 12px;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-danger {
      background: rgba(244, 67, 54, 0.2);
      color: #F44336;
    }

    .btn-danger:hover {
      background: rgba(244, 67, 54, 0.3);
    }

    .saves-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .save-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      border: 1px solid #2d2d44;
    }

    .save-info {
      display: flex;
      flex-direction: column;
    }

    .save-name {
      color: #e0e0e0;
      font-weight: 600;
      font-size: 14px;
    }

    .save-date {
      color: #888;
      font-size: 12px;
    }

    .save-actions {
      display: flex;
      gap: 8px;
    }

    .empty-text {
      color: #666;
      font-style: italic;
      font-size: 13px;
      text-align: center;
      margin: 8px 0;
    }
  `]
})
export class MenuPageComponent {
  playerName = '';
  saves: SaveSummaryDTO[] = [];

  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    this.loadSavesList();
  }

  startNewGame(): void {
    if (!this.playerName.trim()) return;

    this.gameService.newGame(this.playerName.trim()).subscribe({
      next: (state) => {
        this.router.navigate(['/game', state.sessionId]);
      },
      error: (err) => {
        console.error('Failed to create game:', err);
      }
    });
  }

  loadSavesList(): void {
    this.gameService.listSaves().subscribe({
      next: (saves) => this.saves = saves,
      error: (err) => console.error('Failed to load saves:', err)
    });
  }

  loadSave(sessionId: string): void {
    this.gameService.loadGame(sessionId).subscribe({
      next: () => {
        this.router.navigate(['/game', sessionId]);
      },
      error: (err) => console.error('Failed to load game:', err)
    });
  }

  deleteSave(sessionId: string): void {
    this.gameService.deleteGame(sessionId).subscribe({
      next: () => this.loadSavesList(),
      error: (err) => console.error('Failed to delete save:', err)
    });
  }
}
