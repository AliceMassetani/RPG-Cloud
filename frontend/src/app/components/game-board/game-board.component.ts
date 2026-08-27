import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityDTO, Direction } from '../../models/game.models';

/**
 * Renders the RPG grid map as an interactive game board.
 * Each tile shows the hero (H), monsters (M), or empty space.
 * Captures arrow key input and emits move events.
 */
@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="game-board" tabindex="0">
      <div class="grid" [style.grid-template-columns]="'repeat(' + mapWidth + ', 1fr)'">
        @for (row of rows; track row) {
          @for (col of cols; track col) {
            <div class="tile" [ngClass]="getTileClass(col, row)">
              <span class="tile-symbol">{{ getTileSymbol(col, row) }}</span>
              @if (getEntity(col, row); as entity) {
                <div class="tile-hp-bar">
                  <div class="tile-hp-fill"
                       [style.width.%]="(entity.currentHealth / entity.maxHealth) * 100"
                       [ngClass]="{'hp-low': entity.currentHealth < entity.maxHealth * 0.3}">
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
      <p class="controls-hint">Use arrow keys to move</p>
    </div>
  `,
  styles: [`
    .game-board {
      outline: none;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .grid {
      display: grid;
      gap: 2px;
      background: #1a1a2e;
      padding: 8px;
      border-radius: 12px;
      border: 2px solid #16213e;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    }

    .tile {
      width: 52px;
      height: 52px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.15s ease;
      position: relative;
    }

    .tile-symbol {
      font-family: 'Courier New', monospace;
      font-size: 22px;
      font-weight: bold;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }

    .tile-empty {
      background: #2d2d44;
      color: #555;
    }

    .tile-hero {
      background: linear-gradient(135deg, #4CAF50, #2E7D32);
      color: white;
      box-shadow: 0 0 12px rgba(76, 175, 80, 0.5);
      animation: hero-pulse 2s infinite;
    }

    .tile-monster {
      background: linear-gradient(135deg, #F44336, #C62828);
      color: white;
      box-shadow: 0 0 8px rgba(244, 67, 54, 0.4);
    }

    .tile-hp-bar {
      position: absolute;
      bottom: 3px;
      left: 4px;
      right: 4px;
      height: 4px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 2px;
      overflow: hidden;
    }

    .tile-hp-fill {
      height: 100%;
      background: #4CAF50;
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .hp-low {
      background: #FF5722 !important;
    }

    .controls-hint {
      color: #888;
      font-size: 13px;
      margin: 0;
      font-style: italic;
    }

    @keyframes hero-pulse {
      0%, 100% { box-shadow: 0 0 12px rgba(76, 175, 80, 0.5); }
      50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
    }
  `]
})
export class GameBoardComponent {
  @Input() entities: EntityDTO[] = [];
  @Input() mapWidth = 10;
  @Input() mapHeight = 10;
  @Input() gameOver = false;
  @Output() moveEvent = new EventEmitter<Direction>();

  get rows(): number[] {
    return Array.from({ length: this.mapHeight }, (_, i) => i);
  }

  get cols(): number[] {
    return Array.from({ length: this.mapWidth }, (_, i) => i);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyPress(event: KeyboardEvent): void {
    if (this.gameOver) return;

    const directionMap: Record<string, Direction> = {
      'ArrowUp': 'UP',
      'ArrowDown': 'DOWN',
      'ArrowLeft': 'LEFT',
      'ArrowRight': 'RIGHT'
    };

    const direction = directionMap[event.key];
    if (direction) {
      event.preventDefault();
      this.moveEvent.emit(direction);
    }
  }

  getEntity(x: number, y: number): EntityDTO | undefined {
    return this.entities.find(e => e.x === x && e.y === y);
  }

  getTileClass(x: number, y: number): string {
    const entity = this.getEntity(x, y);
    if (!entity) return 'tile-empty';
    return entity.type === 'HERO' ? 'tile-hero' : 'tile-monster';
  }

  getTileSymbol(x: number, y: number): string {
    const entity = this.getEntity(x, y);
    if (!entity) return '·';
    return entity.type === 'HERO' ? 'H' : 'M';
  }
}
