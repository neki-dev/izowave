import Phaser from 'phaser';

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
   * @param text - Message
   */
  notice(type: NoticeType, text: string): void
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
  text: string
  timestamp: number
};
