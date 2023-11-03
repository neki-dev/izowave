import { ENEMY_SIZE_PARAMS, ENEMY_TEXTURE_SIZE } from '~const/world/entities/enemy';
import { Environment } from '~lib/environment';
import { GameFlag, GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { IParticlesParent, ParticlesTexture } from '~type/world/effects';
import { IParticlesManager } from '~type/world/effects/particles-manager';
import { IBuilding } from '~type/world/entities/building';
import { INPC } from '~type/world/entities/npc';
import { EnemyTexture, IEnemy } from '~type/world/entities/npc/enemy';
import { IPlayer } from '~type/world/entities/player';
import { ISprite } from '~type/world/entities/sprite';
import { PositionAtWorld } from '~type/world/level';

import { Particles } from './particles';

export class ParticlesManager implements IParticlesManager {
  private scene: IWorld;

  constructor(scene: IWorld) {
    this.scene = scene;
  }

  public createDustEffect(parent: IPlayer) {
    if (!this.isEffectsEnabled()) {
      return null;
    }

    return new Particles(parent, {
      key: 'dust',
      texture: ParticlesTexture.BIT,
      dynamic: true,
      params: {
        followOffset: {
          x: 0,
          y: -parent.gamut * parent.scaleY * 0.5,
        },
        lifespan: { min: 150, max: 300 },
        scale: 0.6,
        speed: 10,
        frequency: 150,
        alpha: { start: 1.0, end: 0.0 },
        emitting: false,
      },
    });
  }

  public createBloodEffect(parent: ISprite) {
    if (
      !parent.active
      || !Environment.GetFlag(GameFlag.BLOOD)
      || !this.isEffectsEnabled()
      || ParticlesManager.IsExist(parent, 'blood')
    ) {
      return null;
    }

    const scale = Math.min(2.0, parent.displayWidth / 22);

    return new Particles(parent, {
      key: 'blood',
      texture: ParticlesTexture.BIT_SOFT,
      dynamic: true,
      params: {
        duration: 250,
        followOffset: parent.getBodyOffset(),
        lifespan: { min: 100, max: 250 },
        scale: { start: scale, end: scale * 0.25 },
        speed: 60,
        maxAliveParticles: 6,
        tint: 0xdd1e1e,
      },
    });
  }

  public createFrozeEffect(parent: INPC) {
    if (
      !parent.active
      || !this.isEffectsEnabled()
      || ParticlesManager.IsExist(parent, 'froze')
    ) {
      return null;
    }

    const lifespan = Math.min(400, parent.displayWidth * 8);

    return new Particles(parent, {
      key: 'froze',
      texture: ParticlesTexture.BIT_SOFT,
      dynamic: true,
      params: {
        duration: lifespan,
        followOffset: parent.getBodyOffset(),
        color: [0xffffff, 0x8cf9ff, 0x00f2ff],
        colorEase: 'quad.out',
        lifespan: { min: lifespan / 2, max: lifespan },
        scale: { start: 1.0, end: 0.5 },
        speed: 80,
      },
    });
  }

  public createFireEffect(parent: IEnemy) {
    if (
      !parent.active
      || !this.isEffectsEnabled()
      || ParticlesManager.IsExist(parent, 'fire')
    ) {
      return null;
    }

    const lifespan = parent.displayWidth * 6;
    const scale = Math.min(2.0, parent.displayWidth / 22);

    return new Particles(parent, {
      key: 'fire',
      texture: ParticlesTexture.BIT_SOFT,
      dynamic: true,
      params: {
        duration: lifespan,
        followOffset: parent.getBodyOffset(),
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: 'quad.out',
        lifespan: { min: lifespan / 2, max: lifespan },
        scale: { start: scale, end: scale * 0.2 },
        alpha: { start: 1.0, end: 0.0 },
        speed: 80,
      },
    });
  }

  public createLongFireEffect(parent: IEnemy, params: { duration: number }) {
    if (!parent.active || !this.isEffectsEnabled()) {
      return null;
    }

    const lifespan = parent.displayWidth * 25;

    return new Particles(parent, {
      key: 'long-fire',
      texture: ParticlesTexture.BIT_SOFT,
      dynamic: true,
      params: {
        followOffset: parent.getBodyOffset(),
        duration: params.duration,
        color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
        colorEase: 'quad.out',
        lifespan: { min: lifespan / 2, max: lifespan },
        alpha: { start: 1.0, end: 0.0 },
        angle: { min: -100, max: -80 },
        scale: {
          start: parent.displayWidth / 20,
          end: 1.0,
          ease: 'sine.out',
        },
        speed: 40,
        advance: 10,
      },
    });
  }

  public createLazerEffect(parent: IEnemy) {
    if (
      !parent.active
      || !this.isEffectsEnabled()
      || ParticlesManager.IsExist(parent, 'lazer')
    ) {
      return null;
    }

    const lifespan = parent.displayWidth * 5;
    const scale = Math.min(2.25, parent.displayWidth / 18);

    return new Particles(parent, {
      key: 'lazer',
      texture: ParticlesTexture.BIT_SOFT,
      dynamic: true,
      params: {
        duration: lifespan,
        followOffset: parent.getBodyOffset(),
        lifespan: { min: lifespan / 2, max: lifespan },
        scale: { start: scale, end: scale * 0.2 },
        alpha: { start: 1.0, end: 0.0 },
        speed: 80,
        tint: 0xb136ff,
      },
    });
  }

  public createGlowEffect(parent: IParticlesParent, params: { speed: number; color: number }) {
    if (!parent.active || !this.isEffectsEnabled()) {
      return null;
    }

    return new Particles(parent, {
      key: 'glow',
      texture: ParticlesTexture.GLOW,
      dynamic: true,
      params: {
        scale: 0.2 * parent.scale,
        alpha: { start: 1.0, end: 0.0 },
        lifespan: 20000 / params.speed,
        frequency: 10000 / params.speed,
        tint: params.color,
        blendMode: 'ADD',
      },
    });
  }

  public createSpawnEffect(parent: IEnemy) {
    if (!this.isEffectsEnabled()) {
      return null;
    }

    // Native body.center isn't working at current state
    const size = ENEMY_SIZE_PARAMS[ENEMY_TEXTURE_SIZE[parent.texture.key as EnemyTexture]];
    const position: PositionAtWorld = {
      x: parent.x,
      y: parent.y - size.height / 2,
    };
    const duration = Math.min(700, parent.displayHeight * 17);
    const scale = parent.displayWidth / 16;

    return new Particles(parent, {
      key: 'spawn',
      texture: ParticlesTexture.BIT_SOFT,
      position,
      params: {
        duration,
        lifespan: { min: duration / 2, max: duration },
        scale: { start: scale, end: scale / 2 },
        alpha: { start: 1.0, end: 0.0 },
        speed: 40,
        quantity: 1,
        tint: 0x000000,
      },
    });
  }

  public createHealEffect(parent: ISprite, params: { duration: number }) {
    if (
      !this.isEffectsEnabled()
      || ParticlesManager.IsExist(parent, 'heal')
    ) {
      return null;
    }

    return new Particles(parent, {
      key: 'heal',
      texture: ParticlesTexture.PLUS,
      dynamic: true,
      params: {
        followOffset: {
          x: 0,
          y: -parent.displayHeight,
        },
        duration: params.duration,
        lifespan: params.duration,
        alpha: { start: 1.0, end: 0.0 },
        angle: {
          min: -110,
          max: -70,
        },
        scale: {
          start: 1.0,
          end: 0.5,
        },
        speed: 20,
        maxAliveParticles: 1,
      },
    });
  }

  public createGenerationEffect(parent: IBuilding) {
    if (!this.isEffectsEnabled()) {
      return null;
    }

    return new Particles(parent, {
      key: 'generate',
      texture: ParticlesTexture.BIT,
      position: parent.getTopFace(),
      params: {
        duration: 300,
        lifespan: { min: 100, max: 200 },
        scale: { start: 1.0, end: 0.5 },
        alpha: { start: 1.0, end: 0.0 },
        speed: 60,
        maxAliveParticles: 8,
        tint: 0x2dffb2,
      },
    });
  }

  private isEffectsEnabled() {
    return this.scene.game.isSettingEnabled(GameSettings.EFFECTS);
  }

  static IsExist(parent: IParticlesParent, key: string) {
    return Boolean(parent.effects?.[key]);
  }
}
