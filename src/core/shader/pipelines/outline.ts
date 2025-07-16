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
        precision mediump float;
        uniform sampler2D uMainSampler;
        varying vec2 outTexCoord;
        uniform vec2 imageSize;
        uniform float thickness;
        uniform vec3 outlineColor;
        void main() {
          vec4 texture = texture2D(uMainSampler, outTexCoord);
          vec2 mag = vec2(thickness, thickness) / imageSize;
          float upAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, mag.y)).a;
          float leftAlpha = texture2D(uMainSampler, outTexCoord + vec2(-mag.x, 0.0)).a;
          float downAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, -mag.y)).a;
          float rightAlpha = texture2D(uMainSampler, outTexCoord + vec2(mag.x, 0.0)).a;
          if (texture.a == 0.0 && max(max(upAlpha, downAlpha), max(leftAlpha, rightAlpha)) == 1.0) {
            gl_FragColor = vec4(outlineColor.rgb, 1.0);
          } else {
            gl_FragColor = texture;
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
