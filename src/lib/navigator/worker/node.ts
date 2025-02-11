import type { NavigatorPathNodeData } from '../types';

import type { PositionAtMatrix } from '~scene/world/level/types';

export class PathNode {
  readonly position: PositionAtMatrix;

  readonly distance: number;

  private parent: Nullable<PathNode>;

  private cost: number;

  private listOpened: Nullable<boolean> = null;

  constructor({
    position, cost = 1.0, distance, parent = null,
  }: NavigatorPathNodeData) {
    this.position = position;
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

  public getResult() {
    const path: PositionAtMatrix[] = [this.position];
    const cost = this.parent?.cost ?? 0;

    let parent = this.getParent();

    while (parent) {
      path.push(parent.position);
      parent = parent.getParent();
    }

    path.reverse();

    return { path, cost };
  }
}
