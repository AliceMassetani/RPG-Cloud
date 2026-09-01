import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: '', component: MenuPageComponent, canActivate: [authGuard] },
  { path: 'game/:sessionId', component: GamePageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' }
];
