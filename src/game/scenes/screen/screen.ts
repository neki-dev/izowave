import { Interface } from 'phaser-react-ui';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick';

import { INTERFACE_SCALE } from '~const/interface';
import { Scene } from '~game/scenes';
import { registerAudioAssets } from '~lib/assets';
import { GameScene } from '~type/game';
import {
  IScreen, NoticeType, ScreenAudio, ScreenEvents,
} from '~type/screen';

import { ScreenUI } from './interface';

export class Screen extends Scene implements IScreen {
  private joystick: Nullable<VirtualJoystick> = null;

  constructor() {
    super(GameScene.SCREEN);
  }

  public create() {
    new Interface(this, ScreenUI);

    if (!this.game.device.os.desktop) {
      this.createJoystick();
    }
  }

  public update() {
    this.handleJoystick();
  }

  public notice(type: NoticeType, text: string) {
    this.events.emit(ScreenEvents.NOTICE, { type, text });

    if (type === NoticeType.ERROR) {
      this.game.sound.play(ScreenAudio.ERROR);
    }
  }

  private createJoystick() {
    const params = this.getJoystickParams();

    this.joystick = new VirtualJoystick(this, {
      ...params,
      base: this.add.circle(0, 0, params.radius, 0xffffff, 0.25),
      thumb: this.add.circle(0, 0, params.radius / 2, 0xffffff, 0.75),
    });
  }

  private handleJoystick() {
    if (!this.joystick) {
      return;
    }

    const angle = this.joystick.noKey ? null : this.joystick.angle + 180;

    this.game.world.player.setMovementTarget(angle);
  }

  private getJoystickParams() {
    const zoom = Math.max(
      Math.min(
        this.game.canvas.width / INTERFACE_SCALE.target,
        INTERFACE_SCALE.max,
      ),
      INTERFACE_SCALE.min,
    );

    const radius = 80 * zoom;
    const padding = 32 * zoom;

    return {
      x: padding + radius,
      y: this.game.canvas.height - padding - radius,
      radius,
    };
  }
}

registerAudioAssets(ScreenAudio);
