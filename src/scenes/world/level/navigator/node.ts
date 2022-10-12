import Phaser from 'phaser';

import { PathNodeParams } from '~type/navigator';

export class PathNode {
  readonly x: number;

  readonly y: number;

  private distance: number;

  private parent: PathNode;

  private cost: number;

  private listOpened: boolean;

  constructor(
    parent: PathNode,
    { position, cost, distance }: PathNodeParams,
  ) {
    this.parent = parent;
    this.x = position.x;
    this.y = position.y;
    this.cost = cost;
    this.distance = distance;
  }

  public bestGuessDistance(): number {
    return this.cost + this.distance;
  }

  public getCost(): number {
    return this.cost;
  }

  public setCost(cost: number) {
    this.cost = cost;
  }

  public getParent() {
    return this.parent;
  }

  public setParent(parent: PathNode) {
    this.parent = parent;
  }

  public isNewList() {
    return this.listOpened === undefined;
  }

  public isListOpened() {
    return this.listOpened === true;
  }

  public openList() {
    this.listOpened = true;
  }

  public closeList() {
    this.listOpened = false;
  }

  public getPath(): Phaser.Types.Math.Vector2Like[] {
    const path = [{
      x: this.x,
      y: this.y,
    }];

    let parent = this.getParent();
    while (parent) {
      path.push({
        x: parent.x,
        y: parent.y,
      });
      parent = parent.getParent();
    }
    path.reverse();

    return path;
  }
}
