import Phaser from 'phaser';
import { Screen } from '~scene/screen';
import {
  ComponentControl, ComponentInstance, ComponentResizeCallback, ScaleFontParams, ScaleFontResult,
} from '~type/ui';

function bindScreenResize(callback: ComponentResizeCallback) {
  const refresh = () => {
    callback(window.innerWidth, window.innerHeight);
  };

  refresh();
  window.addEventListener('resize', refresh);

  return {
    refresh,
    cancel: () => {
      window.removeEventListener('resize', refresh);
    },
  };
}

export function registerContainerAdaptive(container: Phaser.GameObjects.Container) {
  const provideAdaptive = (width: number, height: number) => {
    if (container.adaptive) {
      container.adaptive(width, height);
    }

    const deepProvideResize = (ctn: Phaser.GameObjects.Container) => {
      ctn.iterate((child: Phaser.GameObjects.GameObject) => {
        if (child.adaptive) {
          child.adaptive(width, height);
        }
        if (child instanceof Phaser.GameObjects.Container) {
          deepProvideResize(child);
        }
      });
    };

    deepProvideResize(container);
  };

  // eslint-disable-next-line no-param-reassign
  container.refreshAdaptive = () => {
    provideAdaptive(window.innerWidth, window.innerHeight);
  };

  const { cancel } = bindScreenResize(provideAdaptive);

  container.on(Phaser.Scenes.Events.DESTROY, cancel);
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
