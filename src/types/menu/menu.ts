export type MenuItem = {
  label: string
  page?: MenuPage
  onClick?: () => void
};

export enum MenuPage {
  NEW_GAME = 'NEW_GAME',
  SETTINGS = 'SETTINGS',
  ABOUT = 'ABOUT',
  CONTROLS = 'CONTROLS',
}
