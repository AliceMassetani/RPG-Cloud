/**
 * TypeScript interfaces mirroring the backend DTOs.
 * These define the JSON contract between Angular and Spring Boot.
 */

export interface GameStateDTO {
  sessionId: string;
  mapWidth: number;
  mapHeight: number;
  hero: HeroDTO;
  entities: EntityDTO[];
  combatLog: string[];
}

export interface HeroDTO {
  name: string;
  currentHealth: number;
  maxHealth: number;
  baseDamage: number;
  inventory: ItemDTO[];
}

export interface EntityDTO {
  type: 'HERO' | 'MONSTER';
  name: string;
  x: number;
  y: number;
  currentHealth: number;
  maxHealth: number;
  baseDamage: number;
}

export interface ItemDTO {
  type: 'WEAPON' | 'POTION';
  name: string;
  quantity: number;
  value: number;
}

export interface SaveSummaryDTO {
  sessionId: string;
  playerName: string;
  createdAt: string;
  updatedAt: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
