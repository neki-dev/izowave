import Phaser from 'phaser';
import { DIFFICULTY } from '~const/difficulty';
import { registerAssets } from '~lib/assets';
import { registerContainerAdaptive } from '~lib/ui';
import { calcGrowth } from '~lib/utils';
import { ComponentBar } from '~scene/screen/components/bar';
import { ComponentBuilder } from '~scene/screen/components/builder';
import { ComponentFPS } from '~scene/screen/components/fps';
import { ComponentGameOver } from '~scene/screen/components/gameover';
import { ComponentNotices } from '~scene/screen/components/notices';
import { ComponentResources } from '~scene/screen/components/resources';
import { ComponentWave } from '~scene/screen/components/wave';
import { World } from '~scene/world';
import { SceneKey } from '~type/scene';
import { ScreenTexture } from '~type/screen';
import { Notice, NoticeType } from '~type/screen/notice';
import { WorldEvents } from '~type/world';
import { LiveEvents } from '~type/world/entities/live';
import { PlayerEvents, PlayerStat } from '~type/world/entities/player';

export class Screen extends Phaser.Scene {
  readonly notices: Notice[] = [];

  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);
    const components = this.add.container();

    /**
     * Wave
     */

    const wave = ComponentWave.call(this, {
      wave: world.wave,
    });

    wave.adaptive = (width: number) => {
      const offset = width * 0.02;

      wave.setPosition(offset, offset);
      wave.setSize(
        Math.max(90, width * 0.08),
        Math.max(23, width * 0.02),
      );
    };

    components.add(wave);

    /**
     * Health bar
     */

    const health = ComponentBar.call(this, {
      display: () => `${world.player.live.health} HP`,
      value: () => world.player.live.health,
      maxValue: () => world.player.live.maxHealth,
      event: (callback: (amount: number) => void) => world.player.live.on(LiveEvents.UPDATE_HEALTH, callback),
      color: 0xe4372c,
    });

    health.adaptive = (width: number, height: number) => {
      const offsetX = width * 0.02;
      const offsetY = height * 0.03;

      health.setPosition(
        offsetX,
        wave.y + wave.height + offsetY,
      );
      health.setSize(
        Math.max(60, width * 0.06),
        Math.max(15, width * 0.015),
      );
    };

    components.add(health);

    /**
     * Experience bar
     */
    const experience = ComponentBar.call(this, {
      display: () => `${world.player.level}  LVL`,
      value: () => world.player.experience,
      maxValue: () => calcGrowth(
        DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL,
        DIFFICULTY.EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
        world.player.level + 1,
      ),
      event: (callback: (amount: number) => void) => world.player.on(PlayerEvents.UPDATE_EXPERIENCE, callback),
      color: 0x1975c5,
    });

    experience.adaptive = (width: number, height: number) => {
      const offsetX = width * 0.02;
      const offsetY = height * 0.008;

      experience.setPosition(
        offsetX,
        health.y + health.height + offsetY,
      );
      experience.setSize(
        Math.max(60, width * 0.06),
        Math.max(15, width * 0.015),
      );
    };

    components.add(experience);

    /**
     * Resources
     */

    const resources = ComponentResources.call(this, {
      player: world.player,
    });

    resources.adaptive = (width: number, height: number) => {
      const offsetX = width * 0.02;
      const offsetY = height * 0.03;

      resources.setPosition(
        offsetX,
        experience.y + experience.height + offsetY,
      );
    };

    components.add(resources);

    /**
     * Notices
     */

    const notices = ComponentNotices.call(this);

    notices.adaptive = (width: number) => {
      const offsetY = width * 0.02;

      notices.setPosition(width / 2, offsetY);
    };

    components.add(notices);

    /**
     * Builder
     */

    const builder = ComponentBuilder.call(this, {
      builder: world.builder,
      wave: world.wave,
      player: world.player,
    });

    builder.adaptive = (width: number) => {
      const offset = width * 0.02;

      builder.setPosition(width - offset, offset);
    };

    components.add(builder);

    /**
     * FPS
     */

    const fps = ComponentFPS.call(this);

    fps.adaptive = (width: number, height: number) => {
      const offset = width * 0.02;

      fps.setPosition(offset, height - offset);
    };

    components.add(fps);

    /**
     * Updating
     */

    registerContainerAdaptive(components);

    world.events.on(WorldEvents.GAMEOVER, (stat: PlayerStat, record: PlayerStat) => {
      components.destroy();

      ComponentGameOver.call(this, { stat, record });
    });
  }

  /**
   * Send notice message.
   *
   * @param type - Notice type
   * @param message - Message
   */
  public message(type: NoticeType, message: string) {
    this.events.emit('notice', { type, message });
  }
}

registerAssets([{
  key: ScreenTexture.ICON,
  type: 'spritesheet',
  url: `assets/sprites/${ScreenTexture.ICON}.png`,
  // @ts-ignore
  frameConfig: {
    frameWidth: 10,
    frameHeight: 10,
  },
}, {
  key: ScreenTexture.ALERT,
  type: 'image',
  url: `assets/sprites/${ScreenTexture.ALERT}.png`,
}]);
