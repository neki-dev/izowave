export enum MenuAudio {
  CLICK = 'ui/click',
}

export type MenuItem = {
  label: string
  active?: boolean
  content?: () => any
  onClick?: () => void
};

export type ControlItem = {
  name: string
  description: string
};
