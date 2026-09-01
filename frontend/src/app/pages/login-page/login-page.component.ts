import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Login/Register page with toggle between the two modes.
 * Styled consistently with the existing dark theme.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1 class="title">⚔️ RPG Cloud</h1>
        <p class="subtitle">A Rogue-like Adventure</p>

        <!-- Mode toggle -->
        <div class="mode-toggle">
          <button
            class="toggle-btn"
            [class.active]="!isRegister"
            (click)="isRegister = false; errorMsg = ''">
            Login
          </button>
          <button
            class="toggle-btn"
            [class.active]="isRegister"
            (click)="isRegister = true; errorMsg = ''">
            Register
          </button>
        </div>

        <!-- Form -->
        <div class="form-section">
          <input
            type="text"
            [(ngModel)]="username"
            placeholder="Username"
            class="form-input"
            (keydown.enter)="passwordInput.focus()"
            autocomplete="username"
          />
          <input
            #passwordInput
            type="password"
            [(ngModel)]="password"
            placeholder="Password"
            class="form-input"
            (keydown.enter)="onSubmit()"
            autocomplete="current-password"
          />

          @if (errorMsg) {
            <div class="error-msg">{{ errorMsg }}</div>
          }

          <button
            class="btn btn-primary"
            (click)="onSubmit()"
            [disabled]="!username.trim() || !password.trim() || loading">
            {{ loading ? '⏳ Loading...' : (isRegister ? '📝 Register' : '🔑 Login') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
      padding: 20px;
    }

    .login-card {
      background: rgba(26, 26, 46, 0.9);
      border: 1px solid #2d2d44;
      border-radius: 20px;
      padding: 40px;
      max-width: 420px;
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

    .mode-toggle {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 24px;
    }

    .toggle-btn {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      background: transparent;
      color: #888;
    }

    .toggle-btn.active {
      background: linear-gradient(135deg, #FFD700, #FFA000);
      color: #1a1a2e;
    }

    .toggle-btn:not(.active):hover {
      color: #ccc;
    }

    .form-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .form-input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid #3d3d5c;
      border-radius: 10px;
      color: #e0e0e0;
      font-size: 16px;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .form-input:focus {
      border-color: #FFD700;
    }

    .form-input::placeholder {
      color: #666;
    }

    .error-msg {
      color: #F44336;
      font-size: 13px;
      text-align: center;
      padding: 8px;
      background: rgba(244, 67, 54, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(244, 67, 54, 0.2);
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
      margin-top: 4px;
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
  `]
})
export class LoginPageComponent {
  username = '';
  password = '';
  isRegister = false;
  errorMsg = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.username.trim() || !this.password.trim()) return;

    this.loading = true;
    this.errorMsg = '';

    const action$ = this.isRegister
      ? this.authService.register(this.username.trim(), this.password)
      : this.authService.login(this.username.trim(), this.password);

    action$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMsg = 'Username already taken.';
        } else if (err.status === 401) {
          this.errorMsg = 'Invalid username or password.';
        } else {
          this.errorMsg = 'An error occurred. Please try again.';
        }
      }
    });
  }
}
