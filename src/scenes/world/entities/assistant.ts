import { ASSISTANT_PATH_BREAKPOINT } from '~const/assistant';
import { DIFFICULTY } from '~const/difficulty';
import { registerAssets } from '~lib/assets';
import { calcGrowth } from '~lib/utils';
import { World } from '~scene/world';
import { NPC } from '~scene/world/entities/npc';
import { AssistantTexture, AssistantData } from '~type/world/entities/assistant';

export class Assistant extends NPC {
  /**
   * Assistant constructor.
   */
  constructor(scene: World, {
    positionAtMatrix,
  }: AssistantData) {
    super(scene, {
      texture: AssistantTexture.ASSISTANT,
      positionAtMatrix,
      speed: DIFFICULTY.ASSISTANT_SPEED,
      health: DIFFICULTY.ASSISTANT_HEALTH,
      damage: DIFFICULTY.ASSISTANT_DAMAGE,
      pathBreakpoint: ASSISTANT_PATH_BREAKPOINT,
    });
    scene.add.existing(this);
    scene.npc.add(this);
  }

  /**
   * Event update.
   */
  public update() {
    const targetReached = super.update();

    if (!targetReached) {
      return;
    }

    this.setVelocity(0, 0);
  }

  /**
   * Upgrade by level.
   *
   * @param level - Player level
   */
  public upgrade(level: number) {
    this.speed = calcGrowth(
      DIFFICULTY.ASSISTANT_SPEED,
      DIFFICULTY.ASSISTANT_SPEED_GROWTH,
      level,
    );

    this.damage = calcGrowth(
      DIFFICULTY.ASSISTANT_DAMAGE,
      DIFFICULTY.ASSISTANT_DAMAGE_GROWTH,
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
}

registerAssets([{
  key: AssistantTexture.ASSISTANT,
  type: 'spritesheet',
  url: `assets/sprites/${AssistantTexture.ASSISTANT}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: 16,
    frameHeight: 16,
  },
}]);
