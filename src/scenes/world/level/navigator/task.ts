import Heap from 'heap';
import Phaser from 'phaser';

import { NavigatorTaskState } from '~type/world/level/navigator';

import { PathNode } from './node';

export class NavigatorTask {
  readonly from: Phaser.Types.Math.Vector2Like;

  readonly to: Phaser.Types.Math.Vector2Like;

  private callback: (path: Phaser.Types.Math.Vector2Like[] | null) => void;

  private tree: PathNode[][] = [];

  private nodes: Heap<PathNode>;

  public state: NavigatorTaskState = NavigatorTaskState.IDLE;

  constructor(
    from: Phaser.Types.Math.Vector2Like,
    to: Phaser.Types.Math.Vector2Like,
    callback: (path: Phaser.Types.Math.Vector2Like[]) => void,
  ) {
    this.from = from;
    this.to = to;
    this.callback = callback;
    this.nodes = new Heap<PathNode>((nodeA, nodeB) => (
      nodeA.bestGuessDistance() - nodeB.bestGuessDistance()
    ));
  }

  public takeLastNode(): PathNode {
    return this.nodes.pop();
  }

  public addNode(node: PathNode) {
    this.nodes.push(node);

    if (!this.tree[node.y]) {
      this.tree[node.y] = [];
    }
    this.tree[node.y][node.x] = node;
  }

  public pickNode(x: number, y: number): PathNode {
    return this.tree[y]?.[x];
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
    this.callback(node.getPath());
  }
}
