import Phaser from 'phaser';

import { GrayscaleShader } from './grayscale';
import { OutlineShader } from './outline';

export const shaders = {
  OutlineShader,
  GrayscaleShader,
};

export function addShader(gameObject: Phaser.GameObjects.Image, shader: string, config?: object) {
  gameObject.setPostPipeline(shader);

  if (config) {
    // @ts-ignore
    gameObject.postPipelines[gameObject.postPipelines.length - 1].setConfig?.(config);
  }
}

export function removeShader(gameObject: Phaser.GameObjects.Image, shader: string) {
  gameObject.removePostPipeline(shader);
}
