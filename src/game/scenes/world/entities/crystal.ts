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
    scene.add.existing(this);
    scene.entityGroups.crystals.add(this);

    const isVisibleTile = this.scene.level.isVisibleTile({ ...positionAtMatrix, z: 0 });

    this.setVisible(isVisibleTile);
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
        texture: ParticlesTexture.BIT,
        positionAtWorld: {
          x: this.x,
          y: this.y + 16,
        },
        params: {
          duration: 200,
          lifespan: { min: 100, max: 200 },
          scale: { start: 1.0, end: 0.5 },
          speed: 50,
          maxAliveParticles: 6,
          tint: 0x2dffb2,
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
