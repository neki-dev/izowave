import Phaser from 'phaser';

type Config = {
  size?: number
  color?: number
};

export class OutlineShader extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
  private size: number = 1.0;

  private color: Phaser.Display.Color = new Phaser.Display.Color(255, 255, 255);

  constructor(game: Phaser.Game) {
    super({
      game,
      name: 'OutlineShader',
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
        uniform vec2 imageSize;
        uniform float thickness;
        uniform vec3 outlineColor;
        const float DOUBLE_PI = 3.14159265358979323846264 * 2.;
        void main() {
          vec4 front = texture2D(uMainSampler, outTexCoord);
          if (thickness > 0.0) {
            vec2 mag = vec2(thickness/imageSize.x, thickness/imageSize.y);
            vec4 curColor;
            float maxAlpha = front.a;
            vec2 offset;
            for (float angle = 0.; angle < DOUBLE_PI; angle += 0.6283185) {
              offset = vec2(mag.x * cos(angle), mag.y * sin(angle));
              curColor = texture2D(uMainSampler, outTexCoord + offset);
              maxAlpha = max(maxAlpha, curColor.a);
            }
            vec3 resultColor = front.rgb + (outlineColor.rgb * (1. - front.a)) * maxAlpha;
            gl_FragColor = vec4(resultColor, maxAlpha);
          } else {
            gl_FragColor = front;
          }
        }
      `,
    });
  }

  public onPreRender() {
    this.set1f('thickness', this.size);
    this.set3f('outlineColor', this.color.redGL, this.color.greenGL, this.color.blueGL);
    this.set2f('imageSize', this.renderer.width, this.renderer.height);
  }

  public setConfig({ size, color }: Config) {
    if (size !== undefined) {
      this.size = size;
    }
    if (color !== undefined) {
      this.color.setFromRGB(Phaser.Display.Color.IntegerToRGB(color));
    }
  }
}
