import BuildingTowerFire from '~scene/world/entities/buildings/towers/fire';
import BuildingMineBronze from '~scene/world/entities/buildings/mines/bronze';
import BuildingMineSilver from '~scene/world/entities/buildings/mines/silver';
import BuildingAmmunition from '~scene/world/entities/buildings/ammunition';

import { GameDifficulty } from '~type/world';

export const WORLD_CAMERA_ZOOM = 1.0;

export const WORLD_COLLIDE_LOOK = 4.0;

export const WORLD_DEPTH_UI = 9999;
export const WORLD_DEPTH_EFFECT = 9998;

export const WORLD_DEFAULT_BUILDINGS = [
  [BuildingTowerFire],
  [BuildingMineBronze, BuildingMineSilver, BuildingAmmunition],
];

export const WORLD_DIFFICULTY_KEY = 'GAME_DIFFICULTY';
export const WORLD_DIFFICULTY_POWERS: {
  [value in GameDifficulty]: number
} = {
  EASY: 0.8,
  NORMAL: 1.0,
  HARD: 1.3,
  UNREAL: 1.8,
};
