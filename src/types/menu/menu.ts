export enum MenuAudio {
  CLICK = 'ui/click',
}

export type MenuItem = {
  label: string
  onClick: () => void
};
