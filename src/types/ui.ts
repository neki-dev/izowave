import Phaser from 'phaser';
import { Screen } from '~scene/screen';

export type ComponentResizeCallback = (width: number, height: number) => void;

export type ComponentControl = {
  update?: () => void
  destroy?: () => void
  resize?: ComponentResizeCallback
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
        adaptive?: (width?: number, height?: number) => void
      }

      interface Container {
        refreshAdaptive?: () => void
        forceUpdate?: () => void
      }
    }
  }
}
