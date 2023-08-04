import Heap from 'heap';

import { equalPositions } from '~lib/utils';
import { Vector2D } from '~type/world/level';
import { NavigatorTaskState, TaskData } from '~type/world/level/navigator';

import { PathNode } from './node';

export class NavigatorTask {
  readonly from: Vector2D;

  readonly to: Vector2D;

  readonly grid: boolean[][];

  private callback: (path: Nullable<Vector2D[]>) => void;

  private tree: PathNode[][] = [];

  private nodes: Heap<PathNode>;

  private compress: boolean = false;

  public state: NavigatorTaskState = NavigatorTaskState.IDLE;

  constructor({
    from, to, callback, grid, compress = false,
  }: TaskData) {
    this.from = from;
    this.to = to;
    this.callback = callback;
    this.grid = grid;
    this.compress = compress;

    this.nodes = new Heap<PathNode>(
      (nodeA, nodeB) => nodeA.bestGuessDistance() - nodeB.bestGuessDistance(),
    );
  }

  public takeLastNode(): Nullable<PathNode> {
    return this.nodes.pop() ?? null;
  }

  public addNode(node: PathNode) {
    this.nodes.push(node);

    if (!this.tree[node.y]) {
      this.tree[node.y] = [];
    }
    this.tree[node.y][node.x] = node;
  }

  public pickNode(position: Vector2D) {
    return this.tree[position.y]?.[position.x];
  }

  public upNode(node: PathNode) {
    this.nodes.updateItem(node);
  }

  public cancel() {
    this.state = NavigatorTaskState.CANCELED;
  }

  public failure() {
    this.state = NavigatorTaskState.FAILED;
    this.callback(null);
  }

  public complete(node: PathNode) {
    this.state = NavigatorTaskState.COMPLETED;

    let path = node.getPath();

    if (this.compress) {
      path = NavigatorTask.CompressPath(path);
    }

    this.callback(path);
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
