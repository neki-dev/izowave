import { IGame, IScene } from '~type/game';

export interface IScreen extends IScene {
  readonly game: IGame

  /**
   * Send notice message.
   * @param type - Notice type
   * @param text - Message
   */
  notice(type: NoticeType, text: string): void
}

export enum ScreenAudio {
  ERROR = 'ui/error',
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
  timestamp?: number
};
