import type { LangPhrase } from '~lib/lang/types';

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
