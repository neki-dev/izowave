import Phaser from 'phaser';
import Text from '~ui/text';

export default class TextNotify extends Text {
  constructor(scene: Phaser.Scene, value: string) {
    super(scene, {
      position: {
        x: scene.sys.game.canvas.width / 2,
        y: -60,
      },
      value,
      origin: [0.5, 0.5],
      fontSize: 40,
      shadow: 4,
      tweens: [{
        y: 200,
        duration: 1000,
        ease: 'Power2',
        hold: 2000,
        yoyo: true,
        onComplete: () => {
          this.destroy();
        },
      }],
    });
  }
}
