import { WorldDifficultyPowers } from '~type/world';

export const WORLD_CAMERA_ZOOM = 1.0;

export const WORLD_COLLIDE_LOOK = 4.0;

export const WORLD_DEPTH_UI = 9999;
export const WORLD_DEPTH_EFFECT = 9998;

export const WORLD_DIFFICULTY_KEY = 'GAME_DIFFICULTY';
export const WORLD_DIFFICULTY_POWERS: WorldDifficultyPowers = {
  EASY: 0.8,
  NORMAL: 1.0,
  HARD: 1.3,
  UNREAL: 1.8,
};
