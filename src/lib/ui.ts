import Phaser from 'phaser';
import { throttle } from '~lib/utils';
import { Screen } from '~scene/screen';
import { ComponentControl, ComponentInstance, ComponentResizeCallback } from '~type/screen/component';

export function adaptiveSize(callback: ComponentResizeCallback) {
  const refresh = throttle(() => {
    callback(window.innerWidth, window.innerHeight);
  }, 100);

  refresh();
  window.addEventListener('resize', refresh);

  return {
    refresh,
    cancel: () => {
      window.removeEventListener('resize', refresh);
    },
  };
}

export function Component<T = any>(component: ComponentInstance<T>) {
  return function create(
    this: Screen,
    position?: Phaser.Types.Math.Vector2Like,
    props?: T,
  ): Phaser.GameObjects.Container {
    const container = this.add.container(position?.x || 0, position?.y || 0);
    const result: ComponentControl = component.call(this, container, props);

    if (result) {
      const { update, destroy, resize } = result;

      if (update) {
        try {
          update();
        } catch (error) {
          console.error('Error on update UI component:', error.message);
        }

        this.events.on(Phaser.Scenes.Events.UPDATE, update, this);
        container.on(Phaser.Scenes.Events.DESTROY, () => {
          this.events.off(Phaser.Scenes.Events.UPDATE, update);
        });
      }

      if (resize) {
        const { cancel } = adaptiveSize(resize);

        container.on(Phaser.Scenes.Events.DESTROY, () => {
          cancel();
        });
      }

      if (destroy) {
        container.on(Phaser.Scenes.Events.DESTROY, destroy, this);
      }
    }

    return container;
  };
}
