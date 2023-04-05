import Phaser from 'phaser';

import { registerAudioAssets, registerImageAssets, registerSpriteAssets } from '~lib/assets';
import { Interface } from '~lib/interface';
import { IGameScene, SceneKey } from '~type/game';
import {
  NoticeType, ScreenAudio, ScreenEvents, ScreenTexture,
} from '~type/screen';

import { ScreenUI } from './ui';

import { Game } from '~game';

export class Screen extends Phaser.Scene implements IGameScene {
  readonly game: Game;

  constructor() {
    super(SceneKey.SCREEN);
  }

  create() {
    new Interface(this, ScreenUI);
  }

  /**
   * Send notice message.
   *
   * @param type - Notice type
   * @param text - Message
   */
  public notice(type: NoticeType, text: string) {
    this.events.emit(ScreenEvents.NOTICE, { type, text });
  }
}

registerAudioAssets(ScreenAudio);
registerImageAssets(ScreenTexture.RESOURCES);
registerSpriteAssets(ScreenTexture.ICON, {
  width: 10,
  height: 10,
});
