import EventEmitter from 'events';

import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { BUILDINGS } from '~const/world/entities/buildings';
import { TILE_META } from '~const/world/level';
import { calcGrowth, equalPositions } from '~lib/utils';
import { Level } from '~scene/world/level';
import { NoticeType } from '~type/screen';
import { TutorialStep, TutorialStepState } from '~type/tutorial';
import { IWorld } from '~type/world';
import { BuilderEvents, IBuilder } from '~type/world/builder';
import { BuildingAudio, BuildingVariant } from '~type/world/entities/building';
import { BiomeType, TileType, Vector2D } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

export class Builder extends EventEmitter implements IBuilder {
  readonly scene: IWorld;

  private _isBuild: boolean = false;

  public get isBuild() { return this._isBuild; }

  private set isBuild(v) { this._isBuild = v; }

  private buildArea: Nullable<Phaser.GameObjects.Ellipse> = null;

  private buildingPreview: Nullable<Phaser.GameObjects.Image> = null;

  private _variant: Nullable<BuildingVariant> = null;

  public get variant() { return this._variant; }

  private set variant(v) { this._variant = v; }

  constructor(scene: IWorld) {
    super();

    this.scene = scene;

    setTimeout(() => {
      this.scene.game.tutorial.beg(TutorialStep.BUILD_TOWER_FIRE);
    }, 500);

    this.scene.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_UP, (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        this.unsetBuildingVariant();
      } else if (Number(e.key)) {
        this.switchBuildingVariant(Number(e.key) - 1);
      }
    });

    this.scene.wave.on(WaveEvents.START, () => {
      this.clearBuildingVariant();
    });

    this.scene.game.tutorial.bind(TutorialStep.BUILD_AMMUNITION, {
      beg: () => {
      this.scene.setTimePause(true);
      },
      end: () => {
      this.scene.setTimePause(false);
      this.clearBuildingVariant();
      },
    });
    this.scene.game.tutorial.bind(TutorialStep.BUILD_GENERATOR, {
      end: () => {
      this.scene.setTimePause(false);
      this.clearBuildingVariant();
      },
    });
    this.scene.game.tutorial.bind(TutorialStep.BUILD_TOWER_FIRE, {
      end: () => {
      this.clearBuildingVariant();
      },
    });
  }

  public update() {
    if (this.isCanBuild()) {
      if (this.isBuild) {
        this.updateBuildArea();
      } else {
        this.openBuilder();
      }
    } else if (this.isBuild) {
      this.closeBuilder();
    }
  }

  public setBuildingVariant(variant: BuildingVariant) {
    if (this.scene.wave.isGoing || this.variant === variant) {
      return;
    }

    if (!this.isBuildingAllowByTutorial(variant)) {
      return;
    }

    const BuildingInstance = BUILDINGS[variant];

    if (!this.isBuildingAllowByWave(variant)) {
      // eslint-disable-next-line max-len
      this.scene.game.screen.notice(NoticeType.ERROR, `${BuildingInstance.Name} WILL BE AVAILABLE ON ${BuildingInstance.AllowByWave} WAVE`);

      return;
    }

    if (this.isBuildingLimitReached(variant)) {
      this.scene.game.screen.notice(NoticeType.ERROR, `YOU HAVE MAXIMUM ${BuildingInstance.Name}`);

      return;
    }

    this.scene.sound.play(BuildingAudio.SELECT);

    this.variant = variant;

    if (this.buildingPreview) {
      this.buildingPreview.setTexture(BuildingInstance.Texture);
    }
  }

  public unsetBuildingVariant() {
    if (this.scene.wave.isGoing || this.variant === null) {
      return;
    }

    this.scene.sound.play(BuildingAudio.UNSELECT);

    this.clearBuildingVariant();
  }

  public addFoundation(position: Vector2D) {
    for (let y = position.y - 1; y <= position.y + 1; y++) {
      for (let x = position.x - 1; x <= position.x + 1; x++) {
        const tileGround = this.scene.level.getTile({ x, y, z: 0 });

        if (tileGround?.biome?.solid) {
          // Replace biome
          const newBiome = Level.GetBiome(BiomeType.RUBBLE);

          if (newBiome) {
            tileGround.biome = newBiome;
            tileGround.clearTint();
            const frame = Array.isArray(newBiome.tileIndex)
              ? Phaser.Math.Between(...newBiome.tileIndex)
              : newBiome.tileIndex;

            tileGround.setFrame(frame);
          }

          // Remove trees
          const tile = this.scene.level.getTileWithType({ x, y, z: 1 }, TileType.TREE);

          if (tile) {
            tile.destroy();
          }
        }
      }
    }
  }

  public isBuildingAllowByTutorial(variant: BuildingVariant) {
    if (this.scene.game.tutorial.state(TutorialStep.WAVE_TIMELEFT) === TutorialStepState.BEG) {
      return false;
    }

    for (const [step, allowedVariant] of <[TutorialStep, BuildingVariant][]> [
      [TutorialStep.BUILD_TOWER_FIRE, BuildingVariant.TOWER_FIRE],
      [TutorialStep.BUILD_GENERATOR, BuildingVariant.GENERATOR],
      [TutorialStep.BUILD_AMMUNITION, BuildingVariant.AMMUNITION],
    ]) {
      if (this.scene.game.tutorial.state(step) === TutorialStepState.BEG) {
        return (variant === allowedVariant);
      }
    }

    return true;
  }

  public isBuildingAllowByWave(variant: BuildingVariant) {
    const waveAllowed = BUILDINGS[variant].AllowByWave;

    if (waveAllowed) {
      return (waveAllowed <= this.scene.wave.number);
    }

    return true;
  }

  public getBuildingLimit(variant: BuildingVariant): Nullable<number> {
    const limit = BUILDINGS[variant].Limit;

    return limit ? limit * (Math.floor(this.scene.wave.number / 5) + 1) : null;
  }

  private getAssumedPosition() {
    return Level.ToMatrixPosition({
      x: this.scene.input.activePointer.worldX,
      y: this.scene.input.activePointer.worldY,
    });
  }

  private openBuilder() {
    if (this.isBuild) {
      return;
    }

    this.createBuildArea();
    this.createBuildingPreview();

    this.scene.input.on(Phaser.Input.Events.POINTER_UP, this.build, this);
    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview, this);

    this.isBuild = true;

    this.emit(BuilderEvents.BUILD_START);
  }

  private closeBuilder() {
    if (!this.isBuild) {
      return;
    }

    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.build);
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.updateBuildingPreview);

    this.destroyBuildingPreview();
    this.destroyBuildArea();

    this.isBuild = false;

    this.emit(BuilderEvents.BUILD_STOP);
  }

  private clearBuildingVariant() {
    this.closeBuilder();
    this.variant = null;
  }

  private switchBuildingVariant(index: number) {
    const variant = Object.values(BuildingVariant)[index];

    if (variant) {
      if (this.variant === variant) {
        this.unsetBuildingVariant();
      } else {
        this.setBuildingVariant(variant);
      }
    }
  }

  private isCanBuild() {
    return (
      this.variant !== null
      && !this.scene.wave.isGoing
      && !this.scene.player.live.isDead()
      && this.scene.player.isStopped()
    );
  }

  private isAllowBuild() {
    const positionAtMatrix = this.getAssumedPosition();

    // Pointer in build area
    const positionAtWorldDown = Level.ToWorldPosition({ ...positionAtMatrix, z: 0 });
    const offset = this.buildArea.getTopLeft();
    const inArea = this.buildArea.geom.contains(
      positionAtWorldDown.x - offset.x,
      positionAtWorldDown.y - offset.y,
    );

    if (!inArea) {
      return false;
    }

    // Pointer biome is solid
    const tileGround = this.scene.level.getTile({ ...positionAtMatrix, z: 0 });

    if (!tileGround?.biome?.solid) {
      return false;
    }

    // Pointer is not contains player or other buildings
    const playerPositionsAtMatrix = this.scene.player.getAllPositionsAtMatrix();
    const isFree = (
      this.scene.level.isFreePoint({ ...positionAtMatrix, z: 1 })
      && !playerPositionsAtMatrix.some((point) => equalPositions(positionAtMatrix, point))
    );

    if (!isFree) {
      return false;
    }

    return true;
  }

  private build() {
    if (!this.buildingPreview.visible) {
      return;
    }

    if (!this.isAllowBuild()) {
      this.scene.sound.play(BuildingAudio.FAILURE);

      return;
    }

    const BuildingInstance = BUILDINGS[this.variant];

    if (this.scene.player.resources < BuildingInstance.Cost) {
      this.scene.game.screen.notice(NoticeType.ERROR, 'NOT ENOUGH RESOURCES');

      return;
    }

    this.scene.player.takeResources(BuildingInstance.Cost);
    this.scene.player.giveExperience(DIFFICULTY.BUILDING_BUILD_EXPERIENCE);

    new BuildingInstance(this.scene, {
      positionAtMatrix: this.getAssumedPosition(),
    });

    if (this.isBuildingLimitReached(this.variant)) {
      this.clearBuildingVariant();
    }

    this.scene.sound.play(BuildingAudio.BUILD);

    switch (TutorialStepState.BEG) {
      case this.scene.game.tutorial.state(TutorialStep.BUILD_TOWER_FIRE): {
        this.scene.game.tutorial.end(TutorialStep.BUILD_TOWER_FIRE);
        this.scene.game.tutorial.beg(TutorialStep.BUILD_GENERATOR);
        break;
      }
      case this.scene.game.tutorial.state(TutorialStep.BUILD_GENERATOR): {
        this.scene.game.tutorial.end(TutorialStep.BUILD_GENERATOR);
        this.scene.game.tutorial.beg(TutorialStep.WAVE_TIMELEFT);
        break;
      }
      case this.scene.game.tutorial.state(TutorialStep.BUILD_AMMUNITION): {
        this.scene.game.tutorial.end(TutorialStep.BUILD_AMMUNITION);
        break;
      }
      default: break;
    }
  }

  private isBuildingLimitReached(variant: BuildingVariant) {
    const limit = this.getBuildingLimit(variant);

    if (limit !== null) {
      return (this.scene.getBuildingsByVariant(variant).length >= limit);
    }

    return false;
  }

  private createBuildArea() {
    const d = calcGrowth(
      DIFFICULTY.BUILDING_BUILD_AREA / this.scene.game.difficulty,
      DIFFICULTY.BUILDING_BUILD_AREA_GROWTH,
      this.scene.player.level,
    ) * 2;

    this.buildArea = this.scene.add.ellipse(0, 0, d, d * TILE_META.persperctive);
    this.buildArea.setStrokeStyle(2, 0xffffff, 0.4);
    this.updateBuildArea();
  }

  private updateBuildArea() {
    const position = this.scene.player.getBottomCenter();
    const out = TILE_META.height * 2;
    const depth = Level.GetDepth(position.y, 1, this.buildArea.height + out);

    this.buildArea.setPosition(position.x, position.y);
    this.buildArea.setDepth(depth);
  }

  private destroyBuildArea() {
    this.buildArea.destroy();
    this.buildArea = null;
  }

  private createBuildingPreview() {
    const BuildingInstance = BUILDINGS[this.variant];

    this.buildingPreview = this.scene.add.image(0, 0, BuildingInstance.Texture);
    this.buildingPreview.setOrigin(0.5, TILE_META.origin);
    this.updateBuildingPreview();
  }

  private updateBuildingPreview() {
    const positionAtMatrix = this.getAssumedPosition();
    const isVisibleTile = this.scene.level.isVisibleTile({ ...positionAtMatrix, z: 0 });

    this.buildingPreview.setVisible(isVisibleTile);

    if (this.buildingPreview.visible) {
      const tilePosition = { ...positionAtMatrix, z: 1 };
      const positionAtWorld = Level.ToWorldPosition(tilePosition);

      this.buildingPreview.setPosition(positionAtWorld.x, positionAtWorld.y);
      this.buildingPreview.setDepth(Level.GetTileDepth(positionAtWorld.y, tilePosition.z));
      this.buildingPreview.setAlpha(this.isAllowBuild() ? 1.0 : 0.25);
    }
  }

  private destroyBuildingPreview() {
    this.buildingPreview.destroy();
    this.buildingPreview = null;
  }
}
