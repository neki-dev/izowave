import Phaser from 'phaser';

import { DIFFICULTY } from '~const/world/difficulty';
import { ComponentBar } from '~game/scenes/screen/components/bar';
import { ComponentBuilder } from '~game/scenes/screen/components/builder';
import { ComponentFPS } from '~game/scenes/screen/components/fps';
import { ComponentGameOver } from '~game/scenes/screen/components/gameover';
import { ComponentNotices } from '~game/scenes/screen/components/notices';
import { ComponentResources } from '~game/scenes/screen/components/resources';
import { ComponentWave } from '~game/scenes/screen/components/wave';
import { registerAudioAssets, registerImageAssets, registerSpriteAssets } from '~lib/assets';
import { switchSize } from '~lib/interface';
import { calcGrowth } from '~lib/utils';
import { GameEvents, GameStat, SceneKey } from '~type/game';
import { ScreenAudio, ScreenTexture } from '~type/screen';
import { NoticeType } from '~type/screen/notice';
import { LiveEvents } from '~type/world/entities/live';
import { PlayerEvents } from '~type/world/entities/player';

import { Game } from '~game';

export class Screen extends Phaser.Scene {
  readonly game: Game;

  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
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
      display: () => `${this.game.world.player.live.health} HP`,
      percent: () => (this.game.world.player.live.health / this.game.world.player.live.maxHealth),
      event: (callback: (amount: number) => void) => {
        this.game.world.player.live.on(LiveEvents.UPDATE_HEALTH, callback);
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
      display: () => `${this.game.world.player.level}  LVL`,
      percent: () => (
        this.game.world.player.experience / calcGrowth(
          DIFFICULTY.PLAYER_EXPERIENCE_TO_NEXT_LEVEL,
          DIFFICULTY.PLAYER_EXPERIENCE_TO_NEXT_LEVEL_GROWTH,
          this.game.world.player.level + 1,
        )
      ),
      event: (callback: (amount: number) => void) => {
        this.game.world.player.on(PlayerEvents.UPDATE_EXPERIENCE, callback);
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

    this.game.events.on(GameEvents.GAMEOVER, (stat: GameStat, record: GameStat) => {
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
