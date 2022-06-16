import Phaser from 'phaser';

type ComponentInstance = (
  this: Phaser.Scene,
  container: Phaser.GameObjects.Container,
  props?: any
) => ({
  update?: () => void
  destroy?: () => void
}) | void;

export default function Component(component: ComponentInstance) {
  return function create(
    this: Phaser.Scene,
    position: Phaser.Types.Math.Vector2Like,
    props?: any,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(position.x, position.y);

    const result = component.call(this, container, props);
    if (result) {
      const { update, destroy } = result;

      if (update) {
        update();
        this.events.on(Phaser.Scenes.Events.UPDATE, update, this);
        container.on(Phaser.Scenes.Events.DESTROY, () => {
          console.log('off');
          this.events.off(Phaser.Scenes.Events.UPDATE, update);
        });
      }

      if (destroy) {
        container.on(Phaser.Scenes.Events.DESTROY, destroy, this);
      }
    }

    return container;
  };
}
