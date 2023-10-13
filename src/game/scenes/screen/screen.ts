import { Interface } from 'phaser-react-ui';
import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick';

import { INTERFACE_SCALE } from '~const/interface';
import { Scene } from '~game/scenes';
import { Assets } from '~lib/assets';
import { GameScene } from '~type/game';
import { LangPhrase } from '~type/lang';
import {
  IScreen, NoticeType, ScreenAudio, ScreenEvents,
} from '~type/screen';

import { ScreenUI } from './interface';

Assets.RegisterAudio(ScreenAudio);

export class Screen extends Scene implements IScreen {
  private joystick: Nullable<VirtualJoystick> = null;

  private _joystickActivePointer: Nullable<Phaser.Input.Pointer> = null;

  public get joystickActivePointer() { return this._joystickActivePointer; }

  private set joystickActivePointer(v) { this._joystickActivePointer = v; }

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

  public notice(type: NoticeType, text: LangPhrase, format?: any[]) {
    this.events.emit(ScreenEvents.NOTICE, { type, text, format });

    if (type === NoticeType.ERROR) {
      this.game.sound.play(ScreenAudio.ERROR);
    }
  }

  private createJoystick() {
    const params = this.getJoystickParams();
    const base = this.add.circle(0, 0, params.radius, 0xffffff, 0.25);

    base.setInteractive();
    base.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      this.joystickActivePointer = pointer;
    });

    this.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (this.joystickActivePointer === pointer) {
        this.joystickActivePointer = null;
      }
    });

    this.scale.on(Phaser.Scale.Events.RESIZE, () => {
      const { x, y } = this.getJoystickParams();

      this.joystick?.setPosition(x, y);
    });

    this.joystick = new VirtualJoystick(this, {
      ...params,
      base,
      thumb: this.add.circle(0, 0, params.radius * 0.5, 0xffffff, 0.75),
    });
  }

  public isJoystickUsing() {
    if (!this.joystick) {
      return false;
    }

    return !this.joystick.noKey;
  }

  private handleJoystick() {
    if (!this.joystick) {
      return;
    }

    const angle = this.joystick.noKey
      ? null
      : (this.joystick.angle + 360) % 360;

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

    const radius = 74 * zoom;
    const padding = 40 * zoom;

    return {
      x: padding + radius,
      y: this.game.canvas.height - padding - radius,
      radius,
    };
  }
}
