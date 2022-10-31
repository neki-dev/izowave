import Phaser from 'phaser';
import { Screen } from '~scene/screen';
import {
  ComponentFunction, ComponentControl, ComponentInstance, ComponentResizeCallback, ScaleFontResult,
} from '~type/ui';

export function useAdaptation(
  object: Phaser.GameObjects.GameObject,
  callback: ComponentResizeCallback,
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
  callback: ComponentResizeCallback,
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

export function Component<T = any>(component: ComponentInstance<T>): ComponentFunction<T> {
  return function create(
    this: Screen,
    props?: T,
  ): Phaser.GameObjects.Container {
    const container = this.add.container();
    const result: ComponentControl = component.call(this, container, props);

    registerContainerAdaptive(container);

    if (result) {
      const { update, destroy } = result;

      if (update) {
        container.forceUpdate = update;

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

      if (destroy) {
        container.on(Phaser.Scenes.Events.DESTROY, destroy, this);
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
): ScaleFontResult {
  const fontSize = switchSize(size);
  let shadowSize = 0;

  text.setFontSize(fontSize);

  if (shadow) {
    shadowSize = Math.round(fontSize * 0.25);

    text.setShadowOffset(shadowSize, shadowSize);
    text.setPadding(0, 0, 0, shadowSize);
  }

  return {
    fontSize,
    shadowSize,
  };
}
