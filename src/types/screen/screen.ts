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
