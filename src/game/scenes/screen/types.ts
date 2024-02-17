import type Phaser from 'phaser';
import type { LangPhrase } from '~lib/lang/types';
import type { IScene } from '~scene/types';

export interface IScreen extends IScene {
  /**
   * Joystick active pointer.
   */
  readonly joystickActivePointer: Nullable<Phaser.Input.Pointer>

  /**
   * Get state of using virtual joystick.
   */
  isJoystickUsing(): boolean

  /**
   * Send failure message.
   * @param text - Phrase key
   * @param format - Values for format
   */
  failure(text?: LangPhrase, format?: any[]): void
}

export enum ScreenAudio {
  ERROR = 'interface/error',
}

export enum ScreenEvent {
  NOTICE = 'notice',
}

export type Notice = {
  text: LangPhrase
  format?: any[]
  timer: NodeJS.Timeout
};
