/* eslint-disable @typescript-eslint/no-namespace */
export enum ShaderType {
  OUTLINE = 'OUTLINE',
}

declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObject {
        addShader(shader: ShaderType, config?: object): void
        updateShader(shader: ShaderType, config: object): void
        removeShader(shader: ShaderType): void
      }
    }

    namespace Renderer {
      namespace WebGL {
        namespace Pipelines {
          interface PostFXPipeline {
            setConfig(config: object): void
          }
        }
      }
    }
  }
}
