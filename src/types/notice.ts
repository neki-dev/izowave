export enum NoticeType {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type Notice = {
  container?: Phaser.GameObjects.Container
  message: string
  type: NoticeType
};
