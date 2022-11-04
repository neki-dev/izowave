import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { registerAudioAssets, registerImageAssets, registerSpriteAssets } from '~lib/assets';
import { switchSize } from '~lib/interface';
import { calcGrowth } from '~lib/utils';
import { ComponentBar } from '~scene/screen/components/bar';
import { ComponentBuilder } from '~scene/screen/components/builder';
import { ComponentFPS } from '~scene/screen/components/fps';
import { ComponentGameOver } from '~scene/screen/components/gameover';
import { ComponentNotices } from '~scene/screen/components/notices';
import { ComponentResources } from '~scene/screen/components/resources';
import { ComponentWave } from '~scene/screen/components/wave';
import { World } from '~scene/world';
import { SceneKey } from '~type/core';
import { ScreenAudio, ScreenTexture } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { WorldEvents } from '~type/world';
import { LiveEvents } from '~type/world/entities/live';
import { PlayerEvents, PlayerStat } from '~type/world/entities/player';

export class Screen extends Phaser.Scene {
  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    const world = <World> this.scene.get(SceneKey.WORLD);
    const components = this.add.container();

    /**
     * Wave
     */

    const wave = ComponentWave(this);

    wave.useAdaptationBefore(() => {
      const offset = switchSize(30);

      wave.setPosition(offset, offset);
    });

    components.add(wave);

    /**
     * Health bar
     */

    const health = ComponentBar(this, {
      display: () => `${world.player.live.health} HP`,
      percent: () => (world.player.live.health / world.player.live.maxHealth),
      event: (callback: (amount: number) => void) => {
        world.player.live.on(LiveEvents.UPDATE_HEALTH, callback);
      },
      color: 0xe4372c,
    });

    health.useAdaptationBefore(() => {
      health.setPosition(
        switchSize(30),
        wave.y + wave.height + switchSize(24),
      );
    });

    components.add(health);

    /**
     * Experience bar
     */

    const experience = ComponentBar(this, {
      display: () => `${world.player.level}  LVL`,
      percent: () => (
        world.player.experience / calcGrowth(
          DIFFICULTY.PLAYER_EXPERIENCE_TO_NEXT_LEVEL,
          DIFFICULTY.PLAYER_EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
          world.player.level + 1,
        )
      ),
      event: (callback: (amount: number) => void) => {
        world.player.on(PlayerEvents.UPDATE_EXPERIENCE, callback);
      },
      color: 0x1975c5,
    });

    experience.useAdaptationBefore(() => {
      experience.setPosition(
        switchSize(30),
        health.y + health.height + switchSize(6),
      );
    });

    components.add(experience);

    /**
     * Resources
     */

    const resources = ComponentResources(this);

    resources.useAdaptationBefore(() => {
      resources.setPosition(
        switchSize(30),
        experience.y + experience.height + switchSize(24),
      );
    });

    components.add(resources);

    /**
     * Notices
     */

    const notices = ComponentNotices(this);

    notices.useAdaptationBefore((width) => {
      notices.setPosition(
        width / 2,
        switchSize(30),
      );
    });

    components.add(notices);

    /**
     * Builder
     */

    const builder = ComponentBuilder(this);

    builder.useAdaptationBefore((width) => {
      const offset = switchSize(30);

      builder.setPosition(
        width - offset,
        offset,
      );
    });

    components.add(builder);

    /**
     * FPS
     */

    if (IS_DEV_MODE) {
      const fps = ComponentFPS(this);

      fps.useAdaptationBefore((width, height) => {
        const offset = switchSize(30);

        fps.setPosition(
          offset,
          height - offset,
        );
      });

      components.add(fps);
    }

    /**
     * Updating
     */

    components.registerAdaptive();

    world.events.on(WorldEvents.GAMEOVER, (stat: PlayerStat, record: PlayerStat) => {
      components.destroy();

      ComponentGameOver(this, { stat, record });
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

registerAudioAssets(ScreenAudio);
registerImageAssets(ScreenTexture.RESOURCES);
registerImageAssets(ScreenTexture.ALERT);
registerSpriteAssets(ScreenTexture.ICON, {
  width: 10,
  height: 10,
});
