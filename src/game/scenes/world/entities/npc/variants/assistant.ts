import { DIFFICULTY } from '~const/world/difficulty';
import { ASSISTANT_PATH_BREAKPOINT, ASSISTANT_TILE_SIZE } from '~const/world/entities/assistant';
import { NPC } from '~entity/npc';
import { ShotBallFire } from '~entity/shot/ball/variants/fire';
import { registerAudioAssets, registerSpriteAssets } from '~lib/assets';
import { calcGrowth, getClosest } from '~lib/utils';
import { Effect } from '~scene/world/effects';
import { IWorld } from '~type/world';
import { EffectTexture } from '~type/world/effects';
import {
  AssistantTexture, AssistantData, AssistantAudio, IAssistant,
} from '~type/world/entities/npc/assistant';
import { IEnemy } from '~type/world/entities/npc/enemy';
import { IShot, ShotParams } from '~type/world/entities/shot';

export class Assistant extends NPC implements IAssistant {
  private shot: IShot;

  private shotDefaultParams: ShotParams;

  private nextAttackTimestamp: number = 0;

  constructor(scene: IWorld, {
    positionAtMatrix,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed: DIFFICULTY.ASSISTANT_SPEED,
      health: DIFFICULTY.ASSISTANT_HEALTH,
      pathFindTriggerDistance: ASSISTANT_PATH_BREAKPOINT,
    });
    scene.add.existing(this);

    this.shot = new ShotBallFire(scene, {
      maxDistance: DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      speed: DIFFICULTY.ASSISTANT_ATTACK_SPEED,
      damage: DIFFICULTY.ASSISTANT_ATTACK_DAMAGE,
    });
    this.shot.setInitiator(this);
    this.shotDefaultParams = this.shot.params;

    this.body.setCircle(this.width / 2, 0, 1);

    this.scene.physics.add.collider(this, this.scene.entityGroups.enemies, (_, enemy: IEnemy) => {
      enemy.attack(this);
    });
  }

  public update() {
    super.update();

    if (this.isPathPassed) {
      this.setVelocity(0, 0);
    }

    if (!this.scene.player.live.isDead()) {
      this.attack();
    }
  }

  public upgrade(level: number) {
    this.speed = calcGrowth(
      DIFFICULTY.ASSISTANT_SPEED,
      DIFFICULTY.ASSISTANT_SPEED_GROWTH,
      level,
    );

    const maxHealth = calcGrowth(
      DIFFICULTY.ASSISTANT_HEALTH,
      DIFFICULTY.ASSISTANT_HEALTH_GROWTH,
      level,
    );

    this.live.setMaxHealth(maxHealth);
    this.live.heal();
  }

  public onDead() {
    if (this.visible) {
      new Effect(this.scene, {
        texture: EffectTexture.EXPLOSION,
        audio: AssistantAudio.DEAD,
        position: this,
      });
    }

    super.onDead();
  }

  private attack() {
    const now = this.scene.getTime();

    if (this.nextAttackTimestamp >= now) {
      return;
    }

    const target = this.getTarget();

    if (!target) {
      return;
    }

    this.shot.params = this.getShotCurrentParams();
    this.shot.shoot(target);

    const pause = calcGrowth(
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE,
      DIFFICULTY.ASSISTANT_ATTACK_PAUSE_GROWTH,
      this.scene.player.level,
    );

    this.nextAttackTimestamp = now + Math.max(pause, 200);
  }

  private getTarget(): Nullable<IEnemy> {
    const maxDistance = calcGrowth(
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE,
      DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
      this.scene.player.level,
    );

    const enemies = this.scene.getEnemies().filter((enemy) => (
      !enemy.live.isDead()
      && Phaser.Math.Distance.BetweenPoints(this, enemy) <= maxDistance
      && !this.scene.level.hasTilesBetweenPositions(this, enemy)
    ));

    return getClosest(enemies, this);
  }

  private getShotCurrentParams() {
    const params: ShotParams = {
      maxDistance: calcGrowth(
        this.shotDefaultParams.maxDistance,
        DIFFICULTY.ASSISTANT_ATTACK_DISTANCE_GROWTH,
        this.scene.player.level,
      ),
      speed: calcGrowth(
        this.shotDefaultParams.speed,
        DIFFICULTY.ASSISTANT_ATTACK_SPEED_GROWTH,
        this.scene.player.level,
      ),
      damage: calcGrowth(
        this.shotDefaultParams.damage,
        DIFFICULTY.ASSISTANT_ATTACK_DAMAGE_GROWTH,
        this.scene.player.level,
      ),
    };

    return params;
  }
}

registerAudioAssets(AssistantAudio);
registerSpriteAssets(AssistantTexture, {
  width: ASSISTANT_TILE_SIZE[0],
  height: ASSISTANT_TILE_SIZE[1],
});
