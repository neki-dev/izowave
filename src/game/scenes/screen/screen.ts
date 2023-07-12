import Phaser from 'phaser';
import { Interface } from 'phaser-react-ui';

import { registerAudioAssets } from '~lib/assets';
import { IGame, GameScene } from '~type/game';
import {
  IScreen, NoticeType, ScreenAudio, ScreenEvents,
} from '~type/screen';

import { ScreenUI } from './interface';

export class Screen extends Phaser.Scene implements IScreen {
  readonly game: IGame;

  constructor() {
    super(GameScene.SCREEN);
  }

  public create() {
    new Interface(this, ScreenUI);
  }

  public notice(type: NoticeType, text: string) {
    this.events.emit(ScreenEvents.NOTICE, { type, text });

    if (type === NoticeType.ERROR) {
      this.game.sound.play(ScreenAudio.ERROR);
    }
  }
}

registerAudioAssets(ScreenAudio);
