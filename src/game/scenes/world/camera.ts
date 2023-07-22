import Phaser from 'phaser';

import { CAMERA_ZOOM } from '~const/world/camera';
import { Level } from '~scene/world/level';
import { IWorld } from '~type/world';
import { ICamera } from '~type/world/camera';

export class Camera implements ICamera {
  private scene: IWorld;

  constructor(scene: IWorld) {
    this.scene = scene;
  }

  public zoomOut() {
    this.scene.cameras.main.zoomTo(CAMERA_ZOOM * 0.5, 10 * 1000);
  }

  public shake() {
    this.scene.cameras.main.shake(100, 0.0005);
  }

  public focusOn(object: Phaser.GameObjects.Sprite) {
    const camera = this.scene.cameras.main;

    camera.resetFX();
    camera.startFollow(object);

    camera.setZoom(CAMERA_ZOOM);
    camera.zoomTo(CAMERA_ZOOM, 100);
  }

  public focusOnLevel() {
    const camera = this.scene.cameras.main;
    const size = this.scene.level.size - 1;
    const beg = Level.ToWorldPosition({ x: 0, y: size, z: 0 });
    const end = Level.ToWorldPosition({ x: size, y: 0, z: 0 });

    camera.setZoom(CAMERA_ZOOM);
    camera.pan(beg.x + (this.scene.sys.canvas.width / 2), beg.y, 0);
    setTimeout(() => {
      camera.pan(end.x - (this.scene.sys.canvas.width / 2), end.y, 2 * 60 * 1000);
    }, 0);
  }
}
