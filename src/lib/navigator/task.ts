/* eslint-disable no-restricted-globals */
import Heap from 'heap';

import { equalPositions } from '~lib/utils';
import { NavigatorTaskData, NavigatorEvent } from '~type/navigator';
import { Vector2D } from '~type/world/level';

import { PathNode } from './node';
import { getCost, getDistance } from './tools';

export class NavigatorTask {
  readonly from: Vector2D;

  readonly to: Vector2D;

  readonly grid: boolean[][];

  readonly id: string;

  private tree: PathNode[][] = [];

  private nodes: Heap<PathNode>;

  private compress: boolean = false;

  constructor({
    id, from, to, grid, compress = false,
  }: NavigatorTaskData) {
    this.id = id ?? 'noid';
    this.from = from;
    this.to = to;
    this.grid = grid;
    this.compress = compress;

    this.nodes = new Heap<PathNode>(
      (nodeA, nodeB) => nodeA.bestGuessDistance() - nodeB.bestGuessDistance(),
    );

    const node = new PathNode({
      position: from,
      distance: getDistance(from, to),
    });

    this.addNode(node);
  }

  public takeLastNode(): Nullable<PathNode> {
    return this.nodes.pop() ?? null;
  }

  public addNode(node: PathNode) {
    this.nodes.push(node);

    if (!this.tree[node.position.y]) {
      this.tree[node.position.y] = [];
    }
    this.tree[node.position.y][node.position.x] = node;
  }

  public pickNode(position: Vector2D) {
    return this.tree[position.y]?.[position.x];
  }

  public upNode(node: PathNode) {
    this.nodes.updateItem(node);
  }

  public failure() {
    self.postMessage({
      event: NavigatorEvent.COMPLETE_TASK,
      payload: {
        id: this.id,
        path: null,
      },
    });
  }

  public complete(node: PathNode) {
    let path = node.getPath();

    if (this.compress) {
      path = NavigatorTask.CompressPath(path);
    }

    self.postMessage({
      event: NavigatorEvent.COMPLETE_TASK,
      payload: {
        id: this.id,
        path,
      },
    });
  }

  public checkAdjacentNode(
    currentNode: PathNode,
    shift: Vector2D,
    points: number[][],
  ) {
    const position: Vector2D = {
      x: currentNode.position.x + shift.x,
      y: currentNode.position.y + shift.y,
    };
    const cost = currentNode.getCost() + getCost(currentNode, shift, points);
    const existNode = this.pickNode(position);

    if (existNode) {
      if (cost < existNode.getCost()) {
        existNode.setCost(cost);
        existNode.setParent(currentNode);
        this.upNode(existNode);
      }
    } else {
      const node = new PathNode({
        parent: currentNode,
        position,
        cost,
        distance: getDistance(position, this.to),
      });

      node.openList();
      this.addNode(node);
    }
  }

  static CompressPath(path: Vector2D[]) {
    if (path.length < 3) {
      return path;
    }

    const compressed: Vector2D[] = [];
    const beg = { ...path[0] };
    let next = { ...path[1] };
    let dir = { x: 0, y: 0 };

    dir = NavigatorTask.GetDirection(next, beg);

    compressed.push(beg);

    for (let i = 2; i < path.length; i++) {
      const current = { ...next };
      const prevDir = { ...dir };

      next = { ...path[i] };
      dir = NavigatorTask.GetDirection(next, current);

      if (!equalPositions(dir, prevDir)) {
        compressed.push(current);
      }
    }

    compressed.push(next);

    return compressed;
  }

  static GetDirection(from: Vector2D, to: Vector2D) {
    const result = {
      x: from.x - to.x,
      y: from.y - to.y,
    };

    const sqrt = Math.sqrt(result.x ** 2 + result.y ** 2);

    result.x /= sqrt;
    result.y /= sqrt;

    return result;
  }
}
