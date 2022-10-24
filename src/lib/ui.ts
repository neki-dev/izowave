import Phaser from 'phaser';
import { Screen } from '~scene/screen';
import {
  ComponentControl, ComponentInstance, ComponentResizeCallback, ScaleFontParams, ScaleFontResult,
} from '~type/ui';

export function useAdaptation(
  object: Phaser.GameObjects.GameObject,
  before: Nullable<ComponentResizeCallback>,
  after: Nullable<ComponentResizeCallback> = null,
): () => void {
  if (!object.adaptives) {
    // eslint-disable-next-line no-param-reassign
    object.adaptives = {
      before: [],
      after: [],
    };
  }

  if (before) {
    object.adaptives.before.push(before);
  }

  if (after) {
    object.adaptives.after.push(after);
  }

  return () => {
    before(window.innerWidth, window.innerHeight); // ?
  };
}

export function callContainerAdaptive(container: Phaser.GameObjects.Container) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (container.adaptives) {
    for (const callback of container.adaptives.before) {
      callback(width, height);
    }
  }

  const deepProvideResize = (ctn: Phaser.GameObjects.Container) => {
    ctn.iterate((child: Phaser.GameObjects.GameObject) => {
      if (child.adaptives) {
        for (const callback of child.adaptives.before) {
          callback(width, height);
        }
      }
      if (child instanceof Phaser.GameObjects.Container) {
        deepProvideResize(child);
      }
      if (child.adaptives) {
        for (const callback of child.adaptives.after) {
          callback(width, height);
        }
      }
    });
  };

  deepProvideResize(container);

  if (container.adaptives) {
    for (const callback of container.adaptives.after) {
      callback(width, height);
    }
  }
}

export function registerContainerAdaptive(container: Phaser.GameObjects.Container) {
  callContainerAdaptive(container);

  // eslint-disable-next-line no-param-reassign
  container.refreshAdaptive = () => {
    callContainerAdaptive(container);
  };

  window.addEventListener('resize', container.refreshAdaptive);

  container.on(Phaser.Scenes.Events.DESTROY, () => {
    window.removeEventListener('resize', container.refreshAdaptive);
  });
}

export function Component<T = any>(component: ComponentInstance<T>) {
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

export function scaleText(text: Phaser.GameObjects.Text, params: ScaleFontParams): ScaleFontResult {
  const fontSize = params.by * params.scale;
  let shadowSize = 0;

  text.setFontSize(fontSize);

  if (params.shadow) {
    shadowSize = fontSize * 0.25;

    text.setShadowOffset(shadowSize, shadowSize);
    text.setPadding(0, 0, 0, shadowSize);
  }

  return {
    fontSize,
    shadowSize,
  };
}
