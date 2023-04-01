import { Vector2D } from '~type/world/level';
import { PathNodeParams } from '~type/world/level/navigator';

export class PathNode {
  readonly x: number;

  readonly y: number;

  readonly distance: number;

  private parent: Nullable<PathNode>;

  private cost: number;

  private listOpened: Nullable<boolean> = null;

  constructor(
    parent: Nullable<PathNode>,
    { position, cost, distance }: PathNodeParams,
  ) {
    this.x = position.x;
    this.y = position.y;
    this.distance = distance;
    this.cost = cost;
    this.parent = parent;
  }

  public bestGuessDistance() {
    return this.cost + this.distance;
  }

  public getCost() {
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
    return (this.listOpened === null);
  }

  public isListOpened() {
    return (this.listOpened === true);
  }

  public openList() {
    this.listOpened = true;
  }

  public closeList() {
    this.listOpened = false;
  }

  public getPath() {
    const path: Vector2D[] = [{
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
