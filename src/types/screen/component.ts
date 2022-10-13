export type ComponentInstance<T> = (
  this: Screen,
  container: Phaser.GameObjects.Container,
  props?: T
) => ({
  update?: () => void
  destroy?: () => void
}) | void;

export type ComponentResizeCallback = (width: number, height: number) => void;
