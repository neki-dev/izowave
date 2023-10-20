/* eslint-disable no-restricted-globals */
import Heap from 'heap';

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

  constructor({
    id, from, to, grid,
  }: NavigatorTaskData) {
    this.id = id ?? 'noid';
    this.from = from;
    this.to = to;
    this.grid = grid;

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
        result: {
          path: null,
          cost: 0,
        },
      },
    });
  }

  public complete(node: PathNode) {
    const result = node.getResult();

    self.postMessage({
      event: NavigatorEvent.COMPLETE_TASK,
      payload: {
        id: this.id,
        result,
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
}
