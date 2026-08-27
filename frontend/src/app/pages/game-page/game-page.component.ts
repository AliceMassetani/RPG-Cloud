import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { GameStateDTO, Direction } from '../../models/game.models';
import { GameBoardComponent } from '../../components/game-board/game-board.component';
import { HeroStatsComponent } from '../../components/hero-stats/hero-stats.component';
import { CombatLogComponent } from '../../components/combat-log/combat-log.component';
import { InventoryComponent } from '../../components/inventory/inventory.component';

/**
 * Main game page that assembles all game components.
 */
@Component({
  selector: 'app-game-page',
  standalone: true,
  imports: [
    CommonModule,
    GameBoardComponent,
    HeroStatsComponent,
    CombatLogComponent,
    InventoryComponent
  ],
  template: `
    <div class="game-container">
      @if (gameState) {
        <!-- Top bar -->
        <div class="top-bar">
          <button class="btn btn-back" (click)="backToMenu()">← Menu</button>
          <h2 class="game-title">⚔️ RPG Cloud</h2>
          <button class="btn btn-save" (click)="saveGame()">
            💾 Save
          </button>
        </div>

        <!-- Main layout -->
        <div class="game-layout">
          <!-- Left sidebar -->
          <div class="sidebar">
            <app-hero-stats [hero]="gameState.hero"></app-hero-stats>
            <app-inventory
              [items]="gameState.hero.inventory"
              [disabled]="isGameOver"
              (useItemEvent)="onUseItem($event)">
            </app-inventory>
          </div>

          <!-- Game board (center) -->
          <app-game-board
            [entities]="gameState.entities"
            [mapWidth]="gameState.mapWidth"
            [mapHeight]="gameState.mapHeight"
            [gameOver]="isGameOver"
            (moveEvent)="onMove($event)">
          </app-game-board>

          <!-- Right sidebar -->
          <div class="sidebar">
            <app-combat-log [messages]="gameState.combatLog"></app-combat-log>
          </div>
        </div>

        <!-- Game over overlay -->
        @if (isGameOver) {
          <div class="game-over-overlay">
            <div class="game-over-card">
              <h2 class="game-over-title">{{ isVictory ? '🎉 Victory!' : '💀 Game Over' }}</h2>
              <p class="game-over-text">
                {{ isVictory ? 'All monsters have been defeated!' : 'Your hero has fallen...' }}
              </p>
              <div class="game-over-actions">
                <button class="btn btn-primary" (click)="backToMenu()">Back to Menu</button>
              </div>
            </div>
          </div>
        }
      } @else {
        <div class="loading">Loading...</div>
      }
    </div>
  `,
  styles: [`
    .game-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      padding: 16px;
      position: relative;
    }

    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding: 0 8px;
    }

    .game-title {
      color: #e0e0e0;
      font-size: 20px;
      margin: 0;
      font-weight: 700;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-back {
      background: rgba(255, 255, 255, 0.1);
      color: #ccc;
    }

    .btn-back:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .btn-save {
      background: linear-gradient(135deg, #2196F3, #1976D2);
      color: white;
    }

    .btn-save:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
    }

    .btn-primary {
      background: linear-gradient(135deg, #FFD700, #FFA000);
      color: #1a1a2e;
      padding: 12px 32px;
      font-size: 16px;
      border-radius: 10px;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
    }

    .game-layout {
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: flex-start;
    }

    .sidebar {
      width: 260px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .loading {
      color: #888;
      font-size: 18px;
      text-align: center;
      padding-top: 100px;
    }

    .game-over-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .game-over-card {
      background: rgba(26, 26, 46, 0.95);
      border: 1px solid #2d2d44;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 16px 64px rgba(0, 0, 0, 0.5);
    }

    .game-over-title {
      color: #e0e0e0;
      font-size: 36px;
      margin: 0 0 12px 0;
    }

    .game-over-text {
      color: #888;
      font-size: 16px;
      margin: 0 0 24px 0;
    }

    .game-over-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    @media (max-width: 1024px) {
      .game-layout {
        flex-direction: column;
        align-items: center;
      }

      .sidebar {
        width: 100%;
        max-width: 540px;
      }
    }
  `]
})
export class GamePageComponent implements OnInit {
  gameState: GameStateDTO | null = null;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    if (sessionId) {
      this.gameService.getGameState(sessionId).subscribe({
        next: (state) => this.gameState = state,
        error: () => this.router.navigate(['/'])
      });
    }
  }

  get isGameOver(): boolean {
    if (!this.gameState) return false;
    const hero = this.gameState.entities.find(e => e.type === 'HERO');
    const monsters = this.gameState.entities.filter(e => e.type === 'MONSTER');
    return !hero || hero.currentHealth <= 0 || monsters.length === 0;
  }

  get isVictory(): boolean {
    if (!this.gameState) return false;
    const hero = this.gameState.entities.find(e => e.type === 'HERO');
    const monsters = this.gameState.entities.filter(e => e.type === 'MONSTER');
    return !!hero && hero.currentHealth > 0 && monsters.length === 0;
  }

  onMove(direction: Direction): void {
    if (!this.gameState || this.isGameOver) return;

    this.gameService.move(this.gameState.sessionId, direction).subscribe({
      next: (state) => this.gameState = state
    });
  }

  onUseItem(itemName: string): void {
    if (!this.gameState) return;

    this.gameService.useItem(this.gameState.sessionId, itemName).subscribe({
      next: (state) => this.gameState = state
    });
  }

  saveGame(): void {
    if (!this.gameState) return;

    this.gameService.saveGame(this.gameState.sessionId).subscribe({
      next: () => {
        // Refresh state to get the "Game saved" log message
        this.gameService.getGameState(this.gameState!.sessionId).subscribe({
          next: (state) => this.gameState = state
        });
      }
    });
  }

  backToMenu(): void {
    this.router.navigate(['/']);
  }
}
