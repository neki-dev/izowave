import Phaser from 'phaser';
import { Screen } from '~scene/screen';

export type ComponentResizeCallback = (width: number, height: number) => void;

export type ComponentControl = {
  update?: () => void
  destroy?: () => void
};

export type ComponentInstance<T> = (
  this: Screen,
  container: Phaser.GameObjects.Container,
  props?: T
) => ComponentControl | void;

export type ScaleFontParams = {
  by: number
  scale: number
  shadow?: boolean
};

export type ScaleFontResult = {
  fontSize: number
  shadowSize: number
};

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        adaptives?: {
          before: ComponentResizeCallback[]
          after: ComponentResizeCallback[]
        }
      }

      interface Container {
        refreshAdaptive?: () => void
        forceUpdate?: () => void
      }
    }
  }
}
