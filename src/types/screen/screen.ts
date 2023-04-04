export enum ScreenTexture {
  ICON = 'ui/icons',
  RESOURCES = 'ui/resources',
}

export enum ScreenAudio {
  ERROR = 'ui/error',
}

export enum ScreenIcon {
  HEALTH = 0,
  RADIUS = 1,
  AMMO = 2,
  HEAL = 3,
  DAMAGE = 4,
  RESOURCES = 5,
  PAUSE = 6,
  SPEED = 7,
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
