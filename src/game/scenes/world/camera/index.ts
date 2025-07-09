import Phaser from 'phaser';

import type { WorldScene } from '..';

import { CAMERA_MIN_ZOOM, CAMERA_MAX_ZOOM } from './const';

import { Level } from '~scene/world/level';

export class Camera {
  private scene: WorldScene;

  constructor(scene: WorldScene) {
    this.scene = scene;
  }

  public zoomOut() {
    this.scene.cameras.main.zoomTo(CAMERA_MIN_ZOOM, 10 * 1000);
  }

  public shake() {
    this.scene.cameras.main.shake(100, 0.0005);
  }

  public focusOn(object: Phaser.GameObjects.Sprite) {
    const camera = this.scene.cameras.main;

    camera.resetFX();
    camera.startFollow(object);
    camera.followOffset.set(0, object.displayHeight);

    if (this.scene.game.canvas.height >= 700) {
      camera.setZoom(CAMERA_MAX_ZOOM * 2);
      camera.zoomTo(CAMERA_MAX_ZOOM, 200);
    } else {
      camera.setZoom(CAMERA_MIN_ZOOM);
    }
  }

  public focusOnLevel() {
    const camera = this.scene.cameras.main;
    const size = this.scene.level.size - 1;
    const beg = Level.ToWorldPosition({ x: 0, y: size }, 0);
    const end = Level.ToWorldPosition({ x: size, y: 0 }, 0);

    camera.setZoom(CAMERA_MAX_ZOOM);
    camera.pan(beg.x + (this.scene.game.canvas.width / 2), beg.y, 0);
    setTimeout(() => {
      camera.pan(end.x - (this.scene.game.canvas.width / 2), end.y, 2 * 60 * 1000);
    }, 0);
  }

  public addZoomControl() {
    if (this.scene.game.isDesktop()) {
      this.scene.input.on(Phaser.Input.Events.POINTER_WHEEL, (pointer: Phaser.Input.Pointer) => {
        const force = pointer.deltaY / 500;

        this.updateZoom(force);
      });
    } else {
      this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, () => {
        if (!this.isZooming()) {
          return;
        }

        const distanceStart = Phaser.Math.Distance.Between(
          this.scene.input.pointer1.downX,
          this.scene.input.pointer1.downY,
          this.scene.input.pointer2.downX,
          this.scene.input.pointer2.downY,
        );
        const distanceCurrent = Phaser.Math.Distance.BetweenPoints(
          this.scene.input.pointer1.position,
          this.scene.input.pointer2.position,
        );
        const force = (distanceStart - distanceCurrent) / 2000;

        this.updateZoom(force);
      });
    }
  }

  public isZooming() {
    if (this.scene.game.screen.isJoystickUsing()) {
      return false;
    }

    return (
      this.scene.input.pointer1.isDown
      && this.scene.input.pointer2.isDown
    );
  }

  private updateZoom(value: number) {
    const camera = this.scene.cameras.main;
    const zoom = camera.zoom - value;
    const clampZoom = Math.min(CAMERA_MAX_ZOOM, Math.max(CAMERA_MIN_ZOOM, zoom));

    camera.zoomTo(clampZoom, 10);
  }
}
