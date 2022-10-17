import Phaser from 'phaser';
import { BUILDINGS } from '~const/buildings';
import { ENEMIES } from '~const/enemies';
import { ENEMY_SPAWN_DISTANCE_FROM_BUILDING, ENEMY_SPAWN_DISTANCE_FROM_PLAYER, ENEMY_SPAWN_POSITIONS } from '~const/enemy';
import { INTERFACE_FONT } from '~const/interface';
import { INPUT_KEY } from '~const/keyboard';
import { LEVEL_BUILDING_PATH_COST, LEVEL_CORNER_PATH_COST, LEVEL_MAP_SIZE } from '~const/level';
import { NPC_PATH_RATE } from '~const/npc';
import { WORLD_DIFFICULTY_KEY, WORLD_DIFFICULTY_POWERS } from '~const/world';
import { Building } from '~entity/building';
import { Chest } from '~entity/chest';
import { NPC } from '~entity/npc';
import { Assistant } from '~entity/npc/variants/assistant';
import { Enemy } from '~entity/npc/variants/enemy';
import { Player } from '~entity/player';
import { getAssetsPack, loadFontFace, registerAssets } from '~lib/assets';
import { setCheatsScheme } from '~lib/cheats';
import { selectClosest } from '~lib/utils';
import { Screen } from '~scene/screen';
import { Builder } from '~scene/world/builder';
import { Effects } from '~scene/world/effects';
import { Level } from '~scene/world/level';
import { Wave } from '~scene/world/wave';
import { SceneKey } from '~type/scene';
import { WorldDifficulty, WorldEvents, WorldTexture } from '~type/world';
import { BuildingVariant } from '~type/world/entities/building';
import { EnemyVariant } from '~type/world/entities/enemy';
import { PlayerStat } from '~type/world/entities/player';
import { SpawnTarget } from '~type/world/level';
import { WaveEvents } from '~type/world/wave';

export class World extends Phaser.Scene {
  /**
   * Group of all NPC.
   */
  private _npc: Phaser.GameObjects.Group;

  public get npc() { return this._npc; }

  private set npc(v) { this._npc = v; }

  /**
   * Group of all enemies.
   */
  private _enemies: Phaser.GameObjects.Group;

  public get enemies() { return this._enemies; }

  private set enemies(v) { this._enemies = v; }

  /**
   * Group of all buildings.
   */

  private _buildings: Phaser.GameObjects.Group;

  public get buildings() { return this._buildings; }

  private set buildings(v) { this._buildings = v; }

  /**
   * Group of all chests.
   */
  private _chests: Phaser.GameObjects.Group;

  public get chests() { return this._chests; }

  private set chests(v) { this._chests = v; }

  /**
   * Group of all shots.
   */
  private _shots: Phaser.GameObjects.Group;

  public get shots() { return this._shots; }

  private set shots(v) { this._shots = v; }

  /**
   * Enemies positions for spawn.
   */
  private enemySpawnPositions: Phaser.Types.Math.Vector2Like[] = [];

  /**
   * Screen scene.
   */
  private _screen: Screen;

  public get screen() { return this._screen; }

  private set screen(v) { this._screen = v; }

  /**
   * Effects manager.
   */
  private _effects: Effects;

  public get effects() { return this._effects; }

  private set effects(v) { this._effects = v; }

  /**
   * Game difficulty type.
   */
  private _difficultyType: WorldDifficulty;

  public get difficultyType() { return this._difficultyType; }

  private set difficultyType(v) { this._difficultyType = v; }

  /**
   * Game difficulty multiply.
   */
  private _difficulty: number;

  public get difficulty() { return this._difficulty; }

  private set difficulty(v) { this._difficulty = v; }

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
   * Global game timer.
   */
  private timer: Phaser.Time.TimerEvent;

  /**
   * Game is started.
   */
  private isStarted: boolean = false;

  /**
   * Pause for finding enemy path to player.
   */
  private pathFindingPause: number = 0;

  /**
   * World constructor.
   */
  constructor() {
    super({
      key: SceneKey.WORLD,
      pack: getAssetsPack(),
    });

    if (IS_DEV_MODE) {
      window.WORLD = this;
    }

    const loadingStatus = document.getElementById('loading-status');

    if (loadingStatus) {
      loadingStatus.innerText = 'ASSETS LOADING';
    }
  }

  /**
   * Create world and open menu.
   */
  public create() {
    this.screen = <Screen> this.scene.get(SceneKey.SCREEN);

    const difficulty = localStorage.getItem(WORLD_DIFFICULTY_KEY);

    if (!difficulty) {
      localStorage.setItem(WORLD_DIFFICULTY_KEY, WorldDifficulty.NORMAL);
    }

    this.sortDepthOptimization();

    loadFontFace(INTERFACE_FONT.PIXEL, 'retro').finally(() => {
      this.prepareGame();
      this.scene.launch(SceneKey.MENU);

      const loadingScreen = document.getElementById('loading-screen');

      if (loadingScreen) {
        loadingScreen.remove();
      }
    });
  }

  /**
   * Get current game time.
   */
  public getTimerNow(): number {
    return Math.floor(this.timer.getElapsed());
  }

  /**
   * Call update events.
   */
  public update() {
    if (!this.isStarted) {
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
   * Get list of buildings with a specific variant.
   *
   * @param variant - Varaint
   */
  public selectBuildings(variant: BuildingVariant): Building[] {
    const buildings = (<Building[]> this.buildings.getChildren());

    return buildings.filter((building) => (building.variant === variant));
  }

  /**
   * Spawn enemy in random position.
   */
  public spawnEnemy(variant: EnemyVariant): Enemy {
    const buildings = this.buildings.getChildren();
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
   * Update navigation points costs.
   */
  public refreshNavigationMeta() {
    const { navigator } = this.level;

    navigator.resetPointsCost();

    for (let y = 0; y < this.level.size; y++) {
      for (let x = 0; x < this.level.size; x++) {
        if (navigator.matrix[y][x] === 1) {
          for (let s = x - 1; s <= x + 1; s++) {
            if (s !== x && navigator.matrix[y]?.[s] === 0) {
              navigator.setPointCost(s, y, LEVEL_CORNER_PATH_COST);
            }
          }
          for (let s = y - 1; s <= y + 1; s++) {
            if (s !== y && navigator.matrix[s]?.[x] === 0) {
              navigator.setPointCost(x, s, LEVEL_CORNER_PATH_COST);
            }
          }
        }
      }
    }

    this.buildings.children.iterate((building: Building) => {
      const { x, y } = building.positionAtMatrix;

      navigator.setPointCost(x, y, LEVEL_BUILDING_PATH_COST);

      for (let iy = y - 1; iy <= y + 1; iy++) {
        for (let ix = x - 1; ix <= x + 1; ix++) {
          if (this.level.getTile({ x: ix, y: iy, z: 0 }) && this.level.isFreePoint({ x: ix, y: iy, z: 1 })) {
            navigator.setPointCost(ix, iy, LEVEL_CORNER_PATH_COST);
          }
        }
      }

      return true;
    });
  }

  /**
   * Spawn player and start game.
   */
  public startGame() {
    this.scene.stop(SceneKey.MENU);

    this.difficultyType = <WorldDifficulty> localStorage.getItem(WORLD_DIFFICULTY_KEY);
    this.difficulty = WORLD_DIFFICULTY_POWERS[this.difficultyType];

    this.wave = new Wave(this);
    this.builder = new Builder(this);

    const positions = this.level.readSpawnPositions(SpawnTarget.PLAYER);

    this.player = new Player(this, Phaser.Utils.Array.GetRandom(positions));

    this.makeChests();
    this.makeDefaultBuildings();

    setCheatsScheme(this.getCheats());

    this.level.hideTiles();
    this.addEntityColliders();

    const camera = this.cameras.main;

    camera.resetFX();
    camera.startFollow(this.player);
    camera.setZoom(1.3);
    camera.zoomTo(1.0, 100);

    this.scene.launch(this.screen);
    this.input.keyboard.on(INPUT_KEY.PAUSE, () => {
      if (this.player.live.isDead()) {
        window.location.reload();
      } else {
        this.toggleGamePause(true);
      }
    });

    this.isStarted = true;

    if (!IS_DEV_MODE) {
      window.onbeforeunload = function confirm() {
        return 'Leave game? No saves!';
      };
    }
  }

  /**
   * Finish game.
   *
   * @param stat - Current stat
   * @param record - Best stat
   */
  public finishGame(stat: PlayerStat, record: PlayerStat) {
    this.events.emit(WorldEvents.GAMEOVER, stat, record);

    this.isStarted = false;

    delete this.wave;
    delete this.builder;

    if (!IS_DEV_MODE) {
      delete window.onbeforeunload;
    }
  }

  /**
   * Toggle game pause.
   *
   * @param state - Pause state
   */
  public toggleGamePause(state: boolean) {
    if (state) {
      this.timer.paused = true;

      this.scene.pause();
      this.scene.launch(SceneKey.MENU, {
        pauseMode: true,
      });
    } else {
      this.timer.paused = false;

      this.scene.stop(SceneKey.MENU);
      this.scene.resume();
    }
  }

  /**
   * Prepare game to start.
   */
  private prepareGame() {
    this.timer = this.time.addEvent({
      delay: Number.MAX_SAFE_INTEGER,
    });
    this.effects = new Effects(this);

    this.makeLevel();
    this.enemySpawnPositions = this.level.readSpawnPositions(SpawnTarget.ENEMY);

    this.makeChestsGroup();
    this.makeBuildingsGroups();
    this.makeNPCGroup();
    this.makeEnemiesGroup();
  }

  /**
   * Find NPC path to target.
   */
  private updateNPCPath() {
    const now = this.getTimerNow();

    if (this.pathFindingPause > now) {
      return;
    }

    this.npc.children.iterate((npc: NPC) => {
      try {
        npc.updatePath();
      } catch (e) {
        console.error('Error on update NPC path:', e);
      }

      return true;
    });

    this.level.navigator.processing();

    this.pathFindingPause = now + NPC_PATH_RATE;
  }

  /**
   * Create chests group.
   */
  private makeChestsGroup() {
    this.chests = this.add.group({
      classType: Chest,
    });
  }

  /**
   * Create buildings and shots group.
   */
  private makeBuildingsGroups() {
    this.buildings = this.add.group({
      classType: Building,
      runChildUpdate: true,
    });

    this.shots = this.add.group({
      runChildUpdate: true,
    });
  }

  /**
   * Create NPC group.
   */
  private makeNPCGroup() {
    this.npc = this.add.group({
      classType: NPC,
      runChildUpdate: true,
    });
  }

  /**
   * Create enemies group.
   */
  private makeEnemiesGroup() {
    this.enemies = this.add.group({
      classType: Enemy,
    });
  }

  /**
   * Add colliders to entities.
   */
  private addEntityColliders() {
    this.physics.add.collider(this.shots, this.enemies, (shot: any, enemy: Enemy) => {
      shot.hit(enemy);
    });

    this.physics.add.collider(this.enemies, this.player, (enemy: Enemy, player: Player) => {
      enemy.attack(player);
    });

    this.physics.add.collider(this.enemies, this.npc, (enemy: Enemy, npc: NPC) => {
      if (npc instanceof Assistant) {
        enemy.attack(npc);
      }
    });
  }

  /**
   * Create level and configure camera.
   */
  private makeLevel() {
    const { canvas } = this.sys;

    this.level = new Level(this);

    const from = Level.ToWorldPosition({ x: 0, y: this.level.size - 1, z: 0 });
    const to = Level.ToWorldPosition({ x: this.level.size - 1, y: 0, z: 0 });
    const camera = this.cameras.main;

    camera.setZoom(1.8);
    camera.pan(from.x + (canvas.width / 2), from.y, 0);
    setTimeout(() => {
      camera.pan(to.x - (canvas.width / 2), to.y, 2 * 60 * 1000);
    }, 0);
  }

  /**
   * Spawn chests on world.
   */
  private makeChests() {
    const positions = this.level.readSpawnPositions(SpawnTarget.CHEST);

    const create = () => new Chest(this, {
      positionAtMatrix: Phaser.Utils.Array.GetRandom(positions),
      variant: Phaser.Math.Between(0, 14),
    });

    // Creating default chests
    const maxCount = Math.ceil(Math.floor(LEVEL_MAP_SIZE / 10) / this.difficulty);

    for (let i = 0; i < maxCount; i++) {
      create();
    }

    this.wave.on(WaveEvents.FINISH, () => {
      // Get missing count of chests
      const newCount = maxCount - this.chests.getTotalUsed();

      if (newCount < 1) {
        return;
      }

      // Creating missing chests
      for (let i = 0; i < newCount; i++) {
        const chest = create();
        const tileGround = this.level.getTile({ ...chest.positionAtMatrix, z: 0 });

        chest.setVisible(tileGround.visible);
      }
    });
  }

  /**
   * Create default buildings close to player.
   */
  private makeDefaultBuildings() {
    const { x, y } = this.player.positionAtMatrix;
    const shift = 2;
    const spawns = [
      { x, y: y - shift },
      { x, y: y + shift },
      { x: x - shift, y },
      { x: x + shift, y },
    ];

    const buildingsVariants = [
      [BuildingVariant.TOWER_FIRE],
    ];

    if (this.difficultyType === WorldDifficulty.EASY) {
      buildingsVariants.push([BuildingVariant.AMMUNITION]);
    }
    if (this.difficultyType !== WorldDifficulty.UNREAL) {
      buildingsVariants.push([BuildingVariant.MINE_BRONZE, BuildingVariant.MINE_SILVER]);
    }

    for (const variant of buildingsVariants) {
      const index = Phaser.Math.Between(0, spawns.length - 1);
      const positionAtMatrix = spawns[index];
      const tileGround = this.level.getTile({ ...positionAtMatrix, z: 0 });

      if (tileGround?.biome.solid) {
        const randomVariant: BuildingVariant = Phaser.Utils.Array.GetRandom(variant);
        const BuildingInstance = BUILDINGS[randomVariant];

        new BuildingInstance(this, positionAtMatrix);
      }

      // Remove occupied position from spawns
      spawns.splice(index, 1);
      if (spawns.length === 0) {
        break;
      }
    }
  }

  /**
   * Cheatcodes.
   */
  private getCheats() {
    return {
      HEALPLS: () => {
        this.player.live.heal();
      },
      RICHBITCH: () => {
        this.player.giveResources({ gold: 9999, silver: 9999, bronze: 9999 });
      },
      BOOSTME: () => {
        this.player.giveExperience(9999);
      },
      GODHAND: () => {
        this.enemies.children.iterate((enemy: Enemy) => {
          enemy.live.kill();

          return true;
        });
      },
      FUTURE: () => {
        if (this.wave.isGoing) {
          this.wave.complete();
        }
        const waveNumber = this.wave.number + Phaser.Math.Between(3, 7);

        this.wave.setNumber(waveNumber);
        this.wave.runTimeleft();
      },
    };
  }

  /**
   * https://github.com/photonstorm/phaser/pull/6217
   */
  private sortDepthOptimization() {
    const ref = this.scene.systems.displayList;

    ref.depthSort = () => {
      if (ref.sortChildrenFlag) {
        ref.list.sort(ref.sortByDepth);
        ref.sortChildrenFlag = false;
      }
    };
  }
}

registerAssets(Object.values(WorldTexture).map((texture) => ({
  key: texture,
  type: 'image',
  url: `assets/sprites/${texture}.png`,
})));
