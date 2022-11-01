import Phaser from 'phaser';

import { Screen } from '~scene/screen';

export type ComponentCreator<T> = (scene: Phaser.Scene, props?: T) => Phaser.GameObjects.Container;

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
      interface GameObject {
        adaptives?: {
          before: ResizeCallback[]
          after: ResizeCallback[]
        }
      }
    }
  }
}
