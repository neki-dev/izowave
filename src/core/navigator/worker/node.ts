import type { NavigatorPathNodeData } from '../types';

import type { PositionAtMatrix } from '~scene/world/level/types';

export class PathNode {
  public readonly position: PositionAtMatrix;

  public readonly distance: number;

  public parent: Nullable<PathNode>;

  public cost: number;

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

    let parent = this.parent;

    while (parent) {
      path.push(parent.position);
      parent = parent.parent;
    }

    path.reverse();

    return { path, cost };
  }
}
