export enum MenuAudio {
  CLICK = 'ui/click',
}

export type MenuItem = {
  label: string
  active?: boolean
  content?: () => Phaser.GameObjects.Container
  onClick?: () => void
};

export type ControlItem = {
  name: string
  description: string
};
