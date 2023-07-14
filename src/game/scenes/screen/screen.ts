import { Interface } from 'phaser-react-ui';

import { Scene } from '~game/scenes';
import { registerAudioAssets } from '~lib/assets';
import { GameScene } from '~type/game';
import {
  IScreen, NoticeType, ScreenAudio, ScreenEvents,
} from '~type/screen';

import { ScreenUI } from './interface';

export class Screen extends Scene implements IScreen {
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
