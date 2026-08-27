import { Routes } from '@angular/router';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { GamePageComponent } from './pages/game-page/game-page.component';

export const routes: Routes = [
  { path: '', component: MenuPageComponent },
  { path: 'game/:sessionId', component: GamePageComponent },
  { path: '**', redirectTo: '' }
];
