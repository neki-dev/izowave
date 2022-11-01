import Phaser from 'phaser';

import {
  ComponentCreator, ComponentControl, ComponentInstance, ResizeCallback,
} from '~type/ui';

export function useAdaptation(
  object: Phaser.GameObjects.GameObject,
  callback: ResizeCallback,
) {
  if (!object.adaptives) {
    // eslint-disable-next-line no-param-reassign
    object.adaptives = {
      before: [],
      after: [],
    };
  }

  object.adaptives.before.push(callback);
}

export function useAdaptationAfter(
  object: Phaser.GameObjects.GameObject,
  callback: ResizeCallback,
) {
  if (!object.adaptives) {
    // eslint-disable-next-line no-param-reassign
    object.adaptives = {
      before: [],
      after: [],
    };
  }

  object.adaptives.after.push(callback);
}

export function refreshAdaptive(
  gameObject: Phaser.GameObjects.GameObject,
  deep: boolean = true,
) {
  if (gameObject.adaptives) {
    for (const callback of gameObject.adaptives.before) {
      callback(window.innerWidth, window.innerHeight);
    }
  }

  if (deep && gameObject instanceof Phaser.GameObjects.Container) {
    gameObject.iterate((child: Phaser.GameObjects.GameObject) => {
      refreshAdaptive(child, deep);
    });
  }

  if (gameObject.adaptives) {
    for (const callback of gameObject.adaptives.after) {
      callback(window.innerWidth, window.innerHeight);
    }
  }
}

export function registerContainerAdaptive(container: Phaser.GameObjects.Container) {
  refreshAdaptive(container);

  const onResize = () => {
    refreshAdaptive(container);
  };

  window.addEventListener('resize', onResize);

  container.on(Phaser.Scenes.Events.DESTROY, () => {
    window.removeEventListener('resize', onResize);
  });
}

export function Component<T = undefined>(instance: ComponentInstance<T>): ComponentCreator<T> {
  return (scene: Phaser.Scene, props?: T): Phaser.GameObjects.Container => {
    const container = scene.add.container();
    const control: ComponentControl = instance.call(scene, container, props);

    registerContainerAdaptive(container);

    if (control) {
      const { update, destroy } = control;

      if (update) {
        update();

        scene.events.on(Phaser.Scenes.Events.UPDATE, update, scene);
        container.on(Phaser.Scenes.Events.DESTROY, () => {
          scene.events.off(Phaser.Scenes.Events.UPDATE, update);
        });
      }

      if (destroy) {
        container.on(Phaser.Scenes.Events.DESTROY, destroy, scene);
      }
    }

    return container;
  };
}

export function switchSize(value: number): number {
  let k: number;

  if (window.innerWidth < 1200) {
    k = 0.83;
  } else if (window.innerWidth < 1600) {
    k = 1.0;
  } else {
    k = 1.17;
  }

  return Math.round(value * k);
}

export function scaleText(
  text: Phaser.GameObjects.Text,
  size: number,
  shadow: boolean = false,
) {
  const fontSize = switchSize(size);
  let shadowSize = 0;

  text.setFontSize(fontSize);

  if (shadow) {
    shadowSize = Math.round(fontSize * 0.25);

    text.setShadowOffset(shadowSize, shadowSize);
    text.setPadding(0, 0, 0, shadowSize);
  }
}
