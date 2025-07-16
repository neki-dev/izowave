import type { LangPhrase } from '~core/lang/types';

export enum ScreenAudio {
  ERROR = 'ScreenAudio:ERROR',
}

export enum ScreenEvent {
  NOTICE = 'notice',
}

export type Notice = {
  text: LangPhrase
  format?: any[]
  timer: NodeJS.Timeout
};
