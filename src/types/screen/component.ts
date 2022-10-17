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
