import Phaser from 'phaser';

import { LangPhrase } from '~type/lang';
import { IScene } from '~type/scene';

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
   * Send notice message.
   * @param type - Notice type
   * @param text - Phrase key
   * @param format - Values for format
   */
  notice(type: NoticeType, text: LangPhrase, format?: any[]): void
}

export enum ScreenAudio {
  ERROR = 'interface/error',
}

export enum ScreenEvents {
  NOTICE = 'notice',
}

export enum NoticeType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type Notice = {
  type: NoticeType
  text: LangPhrase
  timestamp: number
  format?: any[]
};
