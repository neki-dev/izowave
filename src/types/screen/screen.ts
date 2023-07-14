import { IScene } from '~type/scene';

export interface IScreen extends IScene {
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
