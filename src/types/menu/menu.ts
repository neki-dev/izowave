import { IGame, IScene } from '~type/game';

export interface IMenu extends IScene {
  readonly game: IGame
}

export enum MenuAudio {
  CLICK = 'ui/click',
}

export type MenuItem = {
  label: string
  onClick: () => void
};
