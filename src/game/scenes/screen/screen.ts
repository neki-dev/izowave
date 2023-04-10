import Phaser from 'phaser';

import { registerAudioAssets } from '~lib/assets';
import { Interface } from '~lib/interface';
import { IGame, GameScene } from '~type/game';
import {
  IScreen, NoticeType, ScreenAudio, ScreenEvents,
} from '~type/screen';

import { ScreenUI } from './ui';

export class Screen extends Phaser.Scene implements IScreen {
  readonly game: IGame;

  constructor() {
    super(GameScene.SCREEN);
  }

  create() {
    new Interface(this, ScreenUI);
  }

  public notice(type: NoticeType, text: string) {
    this.events.emit(ScreenEvents.NOTICE, { type, text });
  }
}

registerAudioAssets(ScreenAudio);
