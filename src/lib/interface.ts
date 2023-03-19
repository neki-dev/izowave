import Phaser from 'phaser';

import { IGameScene } from '~type/game';
import { ComponentCreator, ComponentInstance, ResizeCallback } from '~type/interface';

Phaser.GameObjects.GameObject.prototype.useAdaptationBefore = function (callback: ResizeCallback) {
  if (!this.adaptives) {
    this.adaptives = {
      before: [],
      after: [],
    };
  }

  this.adaptives.before.push(callback);
};

Phaser.GameObjects.GameObject.prototype.useAdaptationAfter = function (callback: ResizeCallback) {
  if (!this.adaptives) {
    this.adaptives = {
      before: [],
      after: [],
    };
  }

  this.adaptives.after.push(callback);
};

Phaser.GameObjects.GameObject.prototype.refreshAdaptation = function (deep: boolean = true) {
  if (this.adaptives) {
    for (const callback of this.adaptives.before) {
      callback(window.innerWidth, window.innerHeight);
    }
  }

  if (deep && this instanceof Phaser.GameObjects.Container) {
    this.iterate((child: Phaser.GameObjects.GameObject) => {
      child.refreshAdaptation(deep);
    });
  }

  if (this.adaptives) {
    for (const callback of this.adaptives.after) {
      callback(window.innerWidth, window.innerHeight);
    }
  }
};

Phaser.GameObjects.Container.prototype.registerAdaptive = function () {
  this.refreshAdaptation();

  const onResize = () => {
    this.refreshAdaptation();
  };

  window.addEventListener('resize', onResize);

  this.on(Phaser.Scenes.Events.DESTROY, () => {
    window.removeEventListener('resize', onResize);
  });
};

export function Component<T = undefined>(instance: ComponentInstance<T>): ComponentCreator<T> {
  return (scene: IGameScene, props?: T): Phaser.GameObjects.Container => {
    const container = scene.add.container();
    const control = instance.call(scene, container, props);

    container.registerAdaptive();

    if (control) {
      const { update, destroy } = control;

      if (update) {
        const safeUpdate = () => {
          if (container.active) {
            update();
          }
        };

        safeUpdate();

        scene.events.on(Phaser.Scenes.Events.UPDATE, safeUpdate, scene);
        container.on(Phaser.Scenes.Events.DESTROY, () => {
          scene.events.off(Phaser.Scenes.Events.UPDATE, safeUpdate);
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
