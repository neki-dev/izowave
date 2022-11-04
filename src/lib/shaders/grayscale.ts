import Phaser from 'phaser';

export class GrayscaleShader extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
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
        void main (void) {
          vec4 front = texture2D(uMainSampler, outTexCoord);
          float gray = dot(front.rgb, vec3(0.299, 0.587, 0.114));
          gl_FragColor = mix(front, vec4(gray, gray, gray, front.a), 1.0);
        }
      `,
    });
  }
}
