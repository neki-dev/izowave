import type { LangPhrase } from '~lib/lang/types';

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
