import { OutlineShader } from './outline';

export const shaders: Record<string, any> = {
  OutlineShader,
};

Phaser.GameObjects.Image.prototype.addShader = function (shader: string, config?: object) {
  if (!shaders[shader]) {
    console.warn(`Shader '${shader}' is not found`);

    return;
  }

  this.setPostPipeline(shader);
  if (config) {
    this.updateShader(shader, config);
  }
};

Phaser.GameObjects.Image.prototype.updateShader = function (shader: string, config: object) {
  const pipeline = this.postPipelines.find((p: any) => (p.name === shader));

  pipeline?.setConfig?.(config);
};

Phaser.GameObjects.Image.prototype.removeShader = function (shader: string) {
  this.removePostPipeline(shader);
};

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        addShader: (shader: string, config?: object) => void
        updateShader: (shader: string, config: object) => void
        removeShader: (shader: string) => void
      }
    }

    namespace Renderer {
      namespace WebGL {
        namespace Pipelines {
          interface PostFXPipeline {
            setConfig?(config: object): void
          }
        }
      }
    }
  }
}
