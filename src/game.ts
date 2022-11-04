import Phaser from 'phaser';

import { CONTAINER_ID } from '~const/core';
import { shaders } from '~lib/shaders';
import { entries } from '~lib/system';
import { Tutorial } from '~lib/tutorial';
import { Menu } from '~scene/menu';
import { Screen } from '~scene/screen';
import { World } from '~scene/world';

export class Game extends Phaser.Game {
  readonly tutorial: Tutorial;

  constructor() {
    super({
      scene: [World, Screen, Menu],
      pixelArt: true,
      autoRound: true,
      disableContextMenu: true,
      width: window.innerWidth,
      height: window.innerHeight,
      parent: CONTAINER_ID,
      backgroundColor: '#222',
      scale: {
        mode: Phaser.Scale.RESIZE,
      },
      physics: {
        default: 'arcade',
        arcade: {
          // debug: IS_DEV_MODE,
          fps: 60,
          gravity: { y: 0 },
        },
      },
    });

    this.tutorial = new Tutorial();

    this.registerShaders();
  }

  private registerShaders() {
    const renderer = <Phaser.Renderer.WebGL.WebGLRenderer> this.renderer;

    for (const [name, Shader] of entries(shaders)) {
      renderer.pipelines.addPostPipeline(name, Shader);
    }
  }
}
