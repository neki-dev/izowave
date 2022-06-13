/* eslint-disable @typescript-eslint/no-unused-expressions */

import Phaser from 'phaser';

import { INTERFACE_PIXEL_FONT } from '~const/interface';

type TextData = {
  position?: Phaser.Types.Math.Vector2Like
  size?: Phaser.Types.Math.Vector2Like
  value?: string | string[]
  origin?: [number, number]
  update?: (text: Text) => void
  tweens?: Phaser.Types.Tweens.TweenBuilderConfig[] | object[]
  alpha?: number
  color?: string
  fontSize?: number
  fontFamily?: string
  shadow?: false | number
  space?: number
  align?: string
};

export default class Text extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene, {
    position, size, value, update,
    origin = [0, 0.5],
    tweens = [],
    alpha = 1.0,
    color = '#ffffff',
    fontFamily = INTERFACE_PIXEL_FONT,
    fontSize = 11,
    shadow = 2,
    space = 4,
    align = 'left',
  }: TextData) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      color,
      fontFamily,
      fontSize: `${fontSize}px`,
      // @ts-ignore
      lineSpacing: space,
      align,
      padding: {
        bottom: 1,
      },
    };
    if (shadow) {
      style.padding.bottom += shadow * 2;
      style.padding.right = shadow;
      style.shadow = {
        offsetX: shadow,
        offsetY: shadow,
        color: '#000000',
        blur: 0,
        fill: true,
      };
    }
    if (size?.x) {
      style.fixedWidth = size.x;
    }
    if (size?.y) {
      style.fixedHeight = size.y;
    }

    super(scene, position?.x || 0, position?.y || 0, value, style);
    scene.add.existing(this);

    this.setOrigin(...origin);
    this.setAlpha(alpha);

    for (const tween of tweens) {
      scene.tweens.add({
        targets: this,
        ...tween,
      });
    }

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
