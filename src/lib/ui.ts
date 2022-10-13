import Phaser from 'phaser';

import { Screen } from '~scene/screen';
import { ComponentInstance, ComponentResizeCallback } from '~type/screen/component';

export function Component<T = any>(component: ComponentInstance<T>) {
  return function create(
    this: Screen,
    position?: Phaser.Types.Math.Vector2Like,
    props?: T,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(position?.x || 0, position?.y || 0);

    const result = component.call(this, container, props);
    if (result) {
      const { update, destroy } = result;

      if (update) {
        try {
          update();
        } catch (error) {
          console.log('Error on update UI component:', error.message);
        }

        this.events.on(Phaser.Scenes.Events.UPDATE, update, this);
        container.on(Phaser.Scenes.Events.DESTROY, () => {
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

export function adaptiveSize(callback: ComponentResizeCallback) {
  const refresh = () => callback(window.innerWidth, window.innerHeight);
  refresh();
  window.addEventListener('resize', refresh);

  return {
    refresh,
    cancel: () => {
      window.removeEventListener('resize', refresh);
    },
  };
}
