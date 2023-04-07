import Phaser from 'phaser';

import { Vector2D } from '~type/world/level';

export class Hexagon extends Phaser.Geom.Polygon {
  public x: number;

  public y: number;

  public edgeLength: number;

  constructor(x: number, y: number, edgeLength: number) {
    super([]);

    this.x = x;
    this.y = y;
    this.edgeLength = edgeLength;

    this.refresh();
  }

  public contains(x: number, y: number): boolean {
    return Hexagon.Contains(this, x, y);
  }

  public setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.refresh();
  }

  public setSize(edgeLength: number = 0) {
    this.edgeLength = edgeLength;

    this.refresh();
  }

  private refresh() {
    this.setTo(this.getCorners());
  }

  private getCorners() {
    const l = Phaser.Math.PI2 / 6;
    const points: Vector2D[] = [];

    for (let u = 0; u < 6; u++) {
      points.push({
        x: (this.x + this.edgeLength) + Math.sin(u * l) * this.edgeLength,
        y: (this.y + this.edgeLength) - Math.cos(u * l) * this.edgeLength,
      });
    }

    return points;
  }

  static Contains(hexagon: Hexagon, x: number, y: number): boolean {
    return Phaser.Geom.Polygon.Contains(hexagon, x, y);
  }
}
