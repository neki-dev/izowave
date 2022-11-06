import Phaser from 'phaser';

import { WORLD_DEPTH_EFFECT, WORLD_FIND_PATH_RATE } from '~const/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMIES } from '~const/world/entities/enemies';
import {
  ENEMY_SPAWN_DISTANCE_FROM_BUILDING, ENEMY_SPAWN_DISTANCE_FROM_PLAYER, ENEMY_SPAWN_POSITIONS,
} from '~const/world/entities/enemy';
import { Building } from '~entity/building';
import { Chest } from '~entity/chest';
import { NPC } from '~entity/npc';
import { Assistant } from '~entity/npc/variants/assistant';
import { Enemy } from '~entity/npc/variants/enemy';
import { Player } from '~entity/player';
import { ShotBall } from '~entity/shot/ball';
import { entries } from '~lib/system';
import { selectClosest } from '~lib/utils';
import { Builder } from '~scene/world/builder';
import { Level } from '~scene/world/level';
import { Wave } from '~scene/world/wave';
import { SceneKey } from '~type/game';
import { ParticlesList, ParticlesTexture, ParticlesType } from '~type/world/effects';
import { BuildingVariant } from '~type/world/entities/building';
import { LiveEvents } from '~type/world/entities/live';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import { SpawnTarget } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

import { Game } from '~game';

export class World extends Phaser.Scene {
  readonly game: Game;

  /**
   * Groups of entities.
   */
  private _entityGroups: Record<string, Phaser.GameObjects.Group>;

  public get entityGroups() { return this._entityGroups; }

  private set entityGroups(v) { this._entityGroups = v; }

  /**
   * Particles manager.
   */
  private _particles: ParticlesList = {};

  public get particles() { return this._particles; }

  private set particles(v) { this._particles = v; }

  /**
   * Player.
   */
  private _player: Player;

  public get player() { return this._player; }

  private set player(v) { this._player = v; }

  /**
   * Level.
   */
  private _level: Level;

  public get level() { return this._level; }

  private set level(v) { this._level = v; }

  /**
   * Wave.
   */
  private _wave: Wave;

  public get wave() { return this._wave; }

  private set wave(v) { this._wave = v; }

  /**
   * Builder.
   */
  private _builder: Builder;

  public get builder() { return this._builder; }

  private set builder(v) { this._builder = v; }

  /**
   * Enemies positions for spawn.
   */
  private enemySpawnPositions: Phaser.Types.Math.Vector2Like[] = [];

  /**
   * Lifecycle timer.
   */
  private timer: Phaser.Time.TimerEvent;

  /**
   * Pause for finding enemy path to player.
   */
  private nextFindPathTimestamp: number = 0;

  /**
   * World constructor.
   */
  constructor() {
    super(SceneKey.WORLD);
  }

  /**
   * Create world.
   */
  public create() {
    this.registerOptimization();
    this.registerParticles();

    this.makeLevel();
    this.addLifecycle();
    this.enableCheats();
  }

  /**
   * Start world.
   */
  public start() {
    this.wave = new Wave(this);
    this.builder = new Builder(this);

    this.addEntityGroups();
    this.addPlayer();
    this.addChests();
    this.addEntityColliders();

    this.level.hideTiles();
  }

  /**
   * Call update events.
   */
  public update() {
    if (!this.game.started) {
      return;
    }

    try {
      this.player.update();
    } catch (e) {
      console.error('Error on `Player` update:', e);
    }

    try {
      this.builder.update();
    } catch (e) {
      console.error('Error on `Builder` update:', e);
    }

    try {
      this.level.update();
    } catch (e) {
      console.error('Error on `Level` update:', e);
    }

    try {
      this.wave.update();
    } catch (e) {
      console.error('Error on `Wave` update:', e);
    }

    this.updateNPCPath();
  }

  /**
   * Get current game time.
   */
  public getTimerNow(): number {
    return Math.floor(this.timer.getElapsed());
  }

  /**
   * Get game timer pause state.
   */
  public isTimerPaused(): boolean {
    return this.timer.paused;
  }

  /**
   * Set game timer pause state.
   *
   * @param state - Pause state
   */
  public setTimerPause(state: boolean) {
    this.timer.paused = state;
  }

  /**
   * Get list of buildings with a specific variant.
   *
   * @param variant - Varaint
   */
  public selectBuildings(variant: BuildingVariant): Building[] {
    const buildings = (<Building[]> this.entityGroups.buildings.getChildren());

    return buildings.filter((building) => (building.variant === variant));
  }

  /**
   * Spawn enemy in random position.
   */
  public spawnEnemy(variant: EnemyVariant): Enemy {
    const buildings = this.entityGroups.buildings.getChildren();
    const allowedPositions = this.enemySpawnPositions.filter((position) => (
      Phaser.Math.Distance.BetweenPoints(position, this.player.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_PLAYER
      && buildings.every((building: Building) => (
        Phaser.Math.Distance.BetweenPoints(position, building.positionAtMatrix) >= ENEMY_SPAWN_DISTANCE_FROM_BUILDING
      ))
    ));

    if (allowedPositions.length === 0) {
      console.warn('Invalid enemy spawn positions');

      return null;
    }

    const positions = selectClosest(allowedPositions, this.player.positionAtMatrix, ENEMY_SPAWN_POSITIONS);
    const EnemyInstance = ENEMIES[variant];

    return new EnemyInstance(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
    });
  }

  /**
   * Find NPC path to target.
   */
  private updateNPCPath() {
    const now = Date.now();

    if (this.nextFindPathTimestamp > now) {
      return;
    }

    for (const npc of <NPC[]> this.entityGroups.npc.getChildren()) {
      try {
        npc.updatePath();
      } catch (e) {
        console.error('Error on update NPC path:', e);
      }
    }

    this.level.navigator.processing();

    this.nextFindPathTimestamp = now + WORLD_FIND_PATH_RATE;
  }

  /**
   * Add global lifecycle timer.
   */
  private addLifecycle() {
    this.timer = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
      paused: !this.game.tutorial.isDisabled,
      loop: true,
    });
  }

  /**
   * Create entity groups.
   */
  private addEntityGroups() {
    this.entityGroups = {
      chests: this.add.group(),
      buildings: this.add.group({ runChildUpdate: true }),
      shots: this.add.group({ runChildUpdate: true }),
      npc: this.add.group({ runChildUpdate: true }),
      enemies: this.add.group(),
    };
  }

  /**
   * Add colliders to entities.
   */
  private addEntityColliders() {
    this.physics.add.collider(this.entityGroups.shots, this.entityGroups.enemies, (shot: ShotBall, enemy: Enemy) => {
      shot.hit(enemy);
    });

    this.physics.add.collider(this.entityGroups.enemies, this.player, (enemy: Enemy, player: Player) => {
      enemy.attack(player);
    });

    this.physics.add.collider(this.entityGroups.enemies, this.entityGroups.npc, (enemy: Enemy, npc: NPC) => {
      if (npc instanceof Assistant) {
        enemy.attack(npc);
      }
    });
  }

  /**
   * Create level and get spawn positions.
   */
  private makeLevel() {
    this.level = new Level(this);
    this.enemySpawnPositions = this.level.readSpawnPositions(SpawnTarget.ENEMY);
  }

  /**
   * Spawn player on world.
   */
  private addPlayer() {
    const positions = this.level.readSpawnPositions(SpawnTarget.PLAYER);

    this.player = new Player(this, Phaser.Utils.Array.GetRandom(positions));

    this.cameras.main.resetFX();
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setZoom(1.3);
    this.cameras.main.zoomTo(1.0, 100);

    this.player.live.on(LiveEvents.DEAD, () => {
      this.game.finishGame();
    });
  }

  /**
   * Spawn chests on world.
   */
  private addChests() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CHEST);

    const create = () => new Chest(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
      variant: Phaser.Math.Between(0, 14),
    });

    // Creating default chests
    const maxCount = Math.ceil(
      Math.floor(this.level.size * DIFFICULTY.CHEST_SPAWN_FACTOR) / this.game.difficulty,
    );

    for (let i = 0; i < maxCount; i++) {
      create();
    }

    // Creating missing chests
    this.wave.on(WaveEvents.COMPLETE, () => {
      const newCount = maxCount - this.entityGroups.chests.getTotalUsed();

      for (let i = 0; i < newCount; i++) {
        const chest = create();
        const isVisibleTile = this.level.isVisibleTile({ ...chest.positionAtMatrix, z: 0 });

        chest.setVisible(isVisibleTile);
      }
    });
  }

  /**
   * Add cheat codes.
   */
  private enableCheats() {
    for (const [cheat, callback] of entries({
      HEALPLS: () => {
        this.player.live.heal();
      },
      RICHBITCH: () => {
        this.player.giveResources(9999);
      },
      BOOSTME: () => {
        this.player.giveExperience(9999);
      },
      GODHAND: () => {
        for (const enemy of <Enemy[]> this.entityGroups.enemies.getChildren()) {
          enemy.live.kill();
        }
      },
      FUTURE: () => {
        this.wave.number += Phaser.Math.Between(3, 7);
        this.wave.runTimeleft();
      },
    })) {
      // @ts-ignore
      window[cheat] = () => {
        if (this.game.started) {
          callback();

          return 'Cheat activated';
        }

        return null;
      };
    }
  }

  /**
   * Add particles for effects.
   */
  private registerParticles() {
    for (const effect of Object.values(ParticlesType)) {
      this.particles[effect] = this.add.particles(ParticlesTexture[effect]);
      this.particles[effect].setDepth(WORLD_DEPTH_EFFECT);
    }
  }

  /**
   * Optimize depth sort.
   */
  private registerOptimization() {
    const ref = this.scene.systems.displayList;

    ref.depthSort = () => {
      if (ref.sortChildrenFlag) {
        ref.list.sort(ref.sortByDepth);
        ref.sortChildrenFlag = false;
      }
    };
  }
}
