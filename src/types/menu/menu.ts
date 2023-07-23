export type MenuItem = {
  label: string
  onClick: () => void
};

export enum MenuPage {
  SETTINGS = 'SETTINGS',
  ABOUT = 'ABOUT',
  CONTROLS = 'CONTROLS',
}
