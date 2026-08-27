import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroDTO } from '../../models/game.models';

/**
 * Displays the hero's stats: name, HP bar, and base damage.
 */
@Component({
  selector: 'app-hero-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (hero) {
      <div class="stats-card">
        <h3 class="hero-name">⚔️ {{ hero.name }}</h3>

        <div class="stat-row">
          <span class="stat-label">HP</span>
          <div class="hp-bar-container">
            <div class="hp-bar-fill"
                 [style.width.%]="hpPercent"
                 [ngClass]="hpClass">
            </div>
            <span class="hp-text">{{ hero.currentHealth }} / {{ hero.maxHealth }}</span>
          </div>
        </div>

        <div class="stat-row">
          <span class="stat-label">ATK</span>
          <span class="stat-value">{{ hero.baseDamage }}</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .stats-card {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .hero-name {
      margin: 0 0 12px 0;
      color: #e0e0e0;
      font-size: 18px;
      font-weight: 600;
    }

    .stat-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #888;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      min-width: 30px;
    }

    .stat-value {
      color: #e0e0e0;
      font-size: 16px;
      font-weight: 600;
    }

    .hp-bar-container {
      flex: 1;
      height: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    .hp-bar-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.4s ease, background 0.4s ease;
    }

    .hp-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
      font-weight: 700;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    .hp-high {
      background: linear-gradient(90deg, #4CAF50, #66BB6A);
    }

    .hp-medium {
      background: linear-gradient(90deg, #FF9800, #FFB74D);
    }

    .hp-low {
      background: linear-gradient(90deg, #F44336, #EF5350);
    }
  `]
})
export class HeroStatsComponent {
  @Input() hero: HeroDTO | null = null;

  get hpPercent(): number {
    if (!this.hero) return 0;
    return (this.hero.currentHealth / this.hero.maxHealth) * 100;
  }

  get hpClass(): string {
    if (this.hpPercent > 50) return 'hp-high';
    if (this.hpPercent > 25) return 'hp-medium';
    return 'hp-low';
  }
}
