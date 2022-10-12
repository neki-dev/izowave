import Phaser from 'phaser';

export class Hexagon extends Phaser.Geom.Polygon {
  public x: number;

  public y: number;

  public size: number;

  constructor(x: number, y: number, size: number) {
    super([]);

    this.x = x;
    this.y = y;
    this.size = size;

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

  public setSize(size: number = 0) {
    this.size = size;

    this.refresh();
  }

  private refresh() {
    this.setTo(this.getCorners());
  }

  private getCorners(): Phaser.Types.Math.Vector2Like[] {
    const l = Phaser.Math.PI2 / 6;
    const points: Phaser.Types.Math.Vector2Like[] = [];
    for (let u = 0; u < 6; u++) {
      points.push({
        x: (this.x + this.size) + Math.sin(u * l) * this.size,
        y: (this.y + this.size) - Math.cos(u * l) * this.size,
      });
    }

    return points;
  }

  static Contains(hexagon: Hexagon, x: number, y: number): boolean {
    return Phaser.Geom.Polygon.Contains(hexagon, x, y);
  }
}
