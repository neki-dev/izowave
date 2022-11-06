import Phaser from 'phaser';

type Config = {
  intensity?: number
};

export class GrayscaleShader extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private _intensity: number;

  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'GrayscaleShader',
      renderTarget: true,
      fragShader: `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        #define highmedp highp
        #else
        #define highmedp mediump
        #endif
        precision highmedp float;
        uniform sampler2D uMainSampler; 
        varying vec2 outTexCoord;
        uniform float intensity;
        void main (void) {
          vec4 front = texture2D(uMainSampler, outTexCoord);
          float gray = dot(front.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = mix(front, vec4(gray, gray, gray, front.a), intensity);
        }
      `,
    });

    this.setConfig({
      intensity: 1.0,
    });
  }

  onPreRender() {
    this.set1f('intensity', this._intensity);
  }

  setConfig({ intensity }: Config) {
    if (intensity !== undefined) {
      this._intensity = intensity;
    }
  }
}
