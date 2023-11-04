import { Analytics } from '~lib/analytics';
import { eachEntries } from '~lib/utils';
import { ShaderType } from '~type/shader';

import { SHADERS } from '../shaders';

export function registerShaders(renderer: Phaser.Renderer.WebGL.WebGLRenderer | Phaser.Renderer.Canvas.CanvasRenderer) {
  if (renderer instanceof Phaser.Renderer.Canvas.CanvasRenderer) {
    Analytics.TrackWarn('WebGL renderer is not supported');

    return;
  }

  eachEntries(SHADERS, (name, Shader) => {
    try {
      renderer.pipelines.addPostPipeline(name, Shader);
    } catch (error) {
      Analytics.TrackWarn(`Failed to register '${name}' shader`, error as TypeError);
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
    Analytics.TrackWarn(`Failed to add '${shader}' shader`, error as TypeError);
  }
};

Phaser.GameObjects.Image.prototype.updateShader = function (shader: ShaderType, config: object) {
  try {
    const pipeline = this.postPipelines.find((postPipeline) => postPipeline.name === shader);

    if (pipeline) {
      pipeline.setConfig(config);
    }
  } catch (error) {
    Analytics.TrackWarn(`Failed to update '${shader}' shader`, error as TypeError);
  }
};

Phaser.GameObjects.Image.prototype.removeShader = function (shader: ShaderType) {
  try {
    this.removePostPipeline(shader);
  } catch (error) {
    Analytics.TrackWarn(`Failed to remove '${shader}' shader`, error as TypeError);
  }
};
