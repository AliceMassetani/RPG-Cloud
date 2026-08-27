import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemDTO } from '../../models/game.models';

/**
 * Displays the hero's inventory with usable items.
 */
@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="inventory-card">
      <h3 class="inventory-title">🎒 Inventory</h3>
      <div class="items-list">
        @for (item of items; track item.name) {
          <div class="item-row">
            <span class="item-icon">{{ item.type === 'POTION' ? '🧪' : '🗡️' }}</span>
            <div class="item-info">
              <span class="item-name">{{ item.name }}</span>
              <span class="item-detail">
                {{ item.type === 'POTION' ? '+' + item.value + ' HP' : item.value + ' DMG' }}
                × {{ item.quantity }}
              </span>
            </div>
            <button class="use-btn" (click)="useItemEvent.emit(item.name)"
                    [disabled]="disabled">
              Use
            </button>
          </div>
        }
        @empty {
          <p class="empty-text">No items yet</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .inventory-card {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }

    .inventory-title {
      margin: 0 0 12px 0;
      color: #e0e0e0;
      font-size: 16px;
      font-weight: 600;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
    }

    .item-icon {
      font-size: 20px;
    }

    .item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .item-name {
      color: #e0e0e0;
      font-size: 14px;
      font-weight: 500;
    }

    .item-detail {
      color: #888;
      font-size: 12px;
    }

    .use-btn {
      padding: 4px 12px;
      background: linear-gradient(135deg, #2196F3, #1976D2);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .use-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(33, 150, 243, 0.4);
    }

    .use-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .empty-text {
      color: #666;
      font-style: italic;
      font-size: 13px;
      margin: 0;
    }
  `]
})
export class InventoryComponent {
  @Input() items: ItemDTO[] = [];
  @Input() disabled = false;
  @Output() useItemEvent = new EventEmitter<string>();
}
