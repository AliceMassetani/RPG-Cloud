import { Component, Input, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Displays the scrollable combat log with auto-scroll to latest messages.
 */
@Component({
  selector: 'app-combat-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="log-card">
      <h3 class="log-title">📜 Combat Log</h3>
      <div class="log-messages" #logContainer>
        @for (message of messages; track $index) {
          <p class="log-entry" [ngClass]="getMessageClass(message)">
            {{ message }}
          </p>
        }
        @empty {
          <p class="log-empty">No events yet. Move your hero to explore!</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .log-card {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      border: 1px solid #2d2d44;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
    }

    .log-title {
      margin: 0 0 12px 0;
      color: #e0e0e0;
      font-size: 16px;
      font-weight: 600;
    }

    .log-messages {
      flex: 1;
      max-height: 200px;
      overflow-y: auto;
      padding-right: 4px;
    }

    .log-messages::-webkit-scrollbar {
      width: 6px;
    }

    .log-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .log-messages::-webkit-scrollbar-thumb {
      background: #444;
      border-radius: 3px;
    }

    .log-entry {
      margin: 0;
      padding: 4px 8px;
      font-size: 13px;
      color: #ccc;
      border-radius: 4px;
      line-height: 1.4;
    }

    .log-entry:nth-child(odd) {
      background: rgba(255, 255, 255, 0.03);
    }

    .log-critical {
      color: #FF9800;
      font-weight: 600;
    }

    .log-defeat {
      color: #4CAF50;
      font-weight: 600;
    }

    .log-gameover {
      color: #F44336;
      font-weight: 700;
      font-size: 14px;
    }

    .log-victory {
      color: #FFD700;
      font-weight: 700;
      font-size: 14px;
    }

    .log-save {
      color: #2196F3;
      font-style: italic;
    }

    .log-empty {
      color: #666;
      font-style: italic;
      font-size: 13px;
      margin: 0;
    }
  `]
})
export class CombatLogComponent implements AfterViewChecked {
  @Input() messages: string[] = [];
  @ViewChild('logContainer') logContainer!: ElementRef;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.logContainer) {
      const el = this.logContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }
  }

  getMessageClass(message: string): string {
    if (message.includes('CRITICAL HIT')) return 'log-critical';
    if (message.includes('defeated')) return 'log-defeat';
    if (message.includes('Game Over') || message.includes('💀')) return 'log-gameover';
    if (message.includes('You win') || message.includes('🎉')) return 'log-victory';
    if (message.includes('saved') || message.includes('loaded')) return 'log-save';
    return '';
  }
}
