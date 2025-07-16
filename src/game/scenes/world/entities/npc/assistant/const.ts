import { ShotBallFire } from '../../shot/ball/variants/fire';
import { ShotBallSimple } from '../../shot/ball/variants/simple';
import { ShotLazer } from '../../shot/lazer';
import type { IShotFactory } from '../../shot/types';

import { AssistantVariant } from './types';

export const ASSISTANT_TILE_SIZE = {
  width: 12,
  height: 24,
  gamut: 4,
};

export const ASSISTANT_PATH_BREAKPOINT = 40;

export const ASSISTANT_UNLOCK_PER_WAVE = 10; // Count waves between assistant variants unlockings

export const ASSISTANT_ATTACK_SPEED = 500; // Attack speed

export const ASSISTANT_ATTACK_DAMAGE = 15; // Attack damage

export const ASSISTANT_ATTACK_DAMAGE_GROWTH = 0.5; // Damage growth by upgrade level (Quadratic)

export const ASSISTANT_ATTACK_DISTANCE = 80; // Attack distance

export const ASSISTANT_ATTACK_DISTANCE_GROWTH = 0.12; // Attack distance growth by upgrade level (Quadratic)

export const ASSISTANT_ATTACK_PAUSE = 1000; // Attack pause

export const ASSISTANT_ATTACK_PAUSE_GROWTH = -0.15; // Attack pause growth by upgrade level (Quadratic)

export const ASSISTANT_WEAPON: Record<AssistantVariant, IShotFactory> = {
  [AssistantVariant.DEFAULT]: ShotBallSimple,
  [AssistantVariant.FIREBOT]: ShotBallFire,
  [AssistantVariant.LASERBOT]: ShotLazer,
};
