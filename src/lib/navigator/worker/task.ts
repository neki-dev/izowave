/* eslint-disable no-restricted-globals */
import Heap from 'heap';

import { NavigatorEvent } from '../types';
import type { NavigatorTaskData, NavigatorPayloadCompleteTask } from '../types';

import { PathNode } from './node';
import { getCost, getSimpleCost } from './tools';

import { getDistance } from '~lib/dimension';
import type { PositionAtMatrix } from '~scene/world/level/types';

export class NavigatorTask {
  readonly from: PositionAtMatrix;

  readonly to: PositionAtMatrix;

  readonly grid: boolean[][];

  readonly id: string;

  private tree: PathNode[][] = [];

  private nodes: Heap<PathNode>;

  private ignoreCosts: boolean = false;

  constructor({
    id, from, to, grid, ignoreCosts = false,
  }: NavigatorTaskData) {
    this.id = id ?? 'noid';
    this.from = from;
    this.to = to;
    this.grid = grid;
    this.ignoreCosts = ignoreCosts;

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

  public pickNode(position: PositionAtMatrix) {
    return this.tree[position.y]?.[position.x];
  }

  public upNode(node: PathNode) {
    this.nodes.updateItem(node);
  }

  public failure() {
    const payload: NavigatorPayloadCompleteTask = {
      id: this.id,
      result: {
        path: null,
        cost: -1,
      },
    };

    self.postMessage({
      event: NavigatorEvent.COMPLETE_TASK,
      payload,
    });
  }

  public complete(node: PathNode) {
    const payload: NavigatorPayloadCompleteTask = {
      id: this.id,
      result: node.getResult(),
    };

    self.postMessage({
      event: NavigatorEvent.COMPLETE_TASK,
      payload,
    });
  }

  public checkAdjacentNode(
    currentNode: PathNode,
    shift: PositionAtMatrix,
    points: number[][],
  ) {
    const position: PositionAtMatrix = {
      x: currentNode.position.x + shift.x,
      y: currentNode.position.y + shift.y,
    };
    const nextCost = this.ignoreCosts
      ? getSimpleCost(shift)
      : getCost(currentNode, shift, points);
    const cost = currentNode.getCost() + nextCost;
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
