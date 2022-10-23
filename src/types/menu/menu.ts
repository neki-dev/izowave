export enum MenuAudio {
  CLICK = 'ui/click',
}

export type MenuItem = {
  label: string
  default?: boolean
  content?: () => any
  onClick?: () => void
};
