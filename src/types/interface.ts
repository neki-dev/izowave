import Phaser from 'phaser';

import { Screen } from '~game/scenes/screen';

export type ComponentCreator<T = undefined> = (scene: Phaser.Scene, props?: T) => Phaser.GameObjects.Container;

export type ComponentControl = {
  update?: () => void
  destroy?: () => void
};

export type ComponentInstance<T> = (
  this: Screen,
  container: Phaser.GameObjects.Container,
  props?: T
) => ComponentControl | void;

export type ResizeCallback = (width: number, height: number) => void;

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface Container {
        registerAdaptive: () => void
      }

      interface GameObject {
        refreshAdaptation: (deep?: boolean) => void
        useAdaptationBefore: (callback: ResizeCallback) => void
        useAdaptationAfter: (callback: ResizeCallback) => void
        adaptives?: {
          before: ResizeCallback[]
          after: ResizeCallback[]
        }
      }
    }
  }
}
