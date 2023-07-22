import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { LEVEL_TILE_SIZE } from '~const/world/level';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { progressionQuadratic } from '~lib/utils';
import { Particles } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { GameSettings } from '~type/game';
import { IWorld } from '~type/world';
import { ParticlesTexture } from '~type/world/effects';
import { EntityType } from '~type/world/entities';
import {
  CrystalTexture, CrystalData, CrystalAudio, ICrystal,
} from '~type/world/entities/crystal';
import { TileType } from '~type/world/level';
import { ITile } from '~type/world/level/tile-matrix';

export class Crystal extends Phaser.GameObjects.Image implements ICrystal, ITile {
  readonly scene: IWorld;

  readonly tileType: TileType = TileType.CRYSTAL;

  constructor(scene: IWorld, {
    positionAtMatrix, variant = 0,
  }: CrystalData) {
    const tilePosition = { ...positionAtMatrix, z: 1 };
    const positionAtWorld = Level.ToWorldPosition(tilePosition);

    super(scene, positionAtWorld.x, positionAtWorld.y, CrystalTexture.CRYSTAL, variant);
    scene.addEntity(EntityType.CRYSTAL, this);

    this.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
    this.setOrigin(0.5, LEVEL_TILE_SIZE.origin);
    this.scene.level.putTile(this, tilePosition);
  }

  public pickup() {
    const resources = this.getResourcesAmount();

    this.scene.player.giveResources(resources);

    this.scene.sound.play(CrystalAudio.PICKUP);

    if (this.scene.game.isSettingEnabled(GameSettings.EFFECTS)) {
      new Particles(this.scene.player, {
        key: 'pickup',
        texture: ParticlesTexture.GLOW,
        positionAtWorld: {
          x: this.x,
          y: this.y + 18,
        },
        params: {
          duration: 300,
          lifespan: { min: 100, max: 200 },
          scale: { start: 0.2, end: 0.05 },
          speed: 60,
          maxAliveParticles: 6,
          tint: 0x2dffb2,
          blendMode: 'ADD',
        },
      });
    }

    this.destroy();
  }

  private getResourcesAmount() {
    return progressionQuadratic(
      Phaser.Math.Between(
        DIFFICULTY.CRYSTAL_RESOURCES - Math.floor(DIFFICULTY.CRYSTAL_RESOURCES * 0.5),
        DIFFICULTY.CRYSTAL_RESOURCES + Math.floor(DIFFICULTY.CRYSTAL_RESOURCES * 0.5),
      ),
      DIFFICULTY.CRYSTAL_RESOURCES_GROWTH,
      this.scene.wave.number,
    );
  }
}

registerAudioAssets(CrystalAudio);
registerSpriteAssets(CrystalTexture, LEVEL_TILE_SIZE);
