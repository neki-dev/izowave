import { SHADERS } from './pipelines';
import type { ShaderType } from './types';

import { Utils } from '~lib/utils';

export function registerShaders(renderer: Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer) {
  if (renderer instanceof Phaser.Renderer.Canvas.CanvasRenderer) {
    console.warn('WebGL renderer is not supported');

    return;
  }

  Utils.EachObject(SHADERS, (name, Shader) => {
    try {
      renderer.pipelines.addPostPipeline(name, Shader);
    } catch (error) {
      console.warn(`Failed to register '${name}' shader`, error as TypeError);
    }
  });
}

Phaser.GameObjects.Image.prototype.addShader = function (shader: ShaderType, config?: object) {
  try {
    this.setPostPipeline(shader);
    if (config) {
      this.updateShader(shader, config);
    }
  } catch (error) {
    console.warn(`Failed to add '${shader}' shader`, error as TypeError);
  }
};

Phaser.GameObjects.Image.prototype.updateShader = function (shader: ShaderType, config: object) {
  try {
    const pipeline = this.postPipelines.find((postPipeline) => postPipeline.name === shader);

    if (pipeline) {
      pipeline.setConfig(config);
    }
  } catch (error) {
    console.warn(`Failed to update '${shader}' shader`, error as TypeError);
  }
};

Phaser.GameObjects.Image.prototype.removeShader = function (shader: ShaderType) {
  try {
    this.removePostPipeline(shader);
  } catch (error) {
    console.warn(`Failed to remove '${shader}' shader`, error as TypeError);
  }
};
