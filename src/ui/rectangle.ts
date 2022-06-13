import Phaser from 'phaser';

type RectangleData = {
  position: Phaser.Types.Math.Vector2Like
  size: Phaser.Types.Math.Vector2Like
  update?: (rectangle: Rectangle) => void
  origin?: [number, number]
  background?: number
  alpha?: number
};

export default class Rectangle extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, {
    position, update, size,
    origin = [0.5, 0.5],
    background = 0x000000,
    alpha = 0.9,
  }: RectangleData) {
    super(
      scene,
      position.x,
      position.y,
      size.x,
      size.y,
      background,
      alpha,
    );
    scene.add.existing(this);

    this.setOrigin(...origin);

    if (update) {
      const updateHandler = () => {
        try {
          update(this);
        } catch (error) {
          console.error(error.message);
        }
      };
      scene.events.on(Phaser.Scenes.Events.UPDATE, updateHandler, this);
      this.on(Phaser.Scenes.Events.DESTROY, () => {
        scene.events.off(Phaser.Scenes.Events.UPDATE, updateHandler);
      });
      updateHandler();
    }
  }
}
