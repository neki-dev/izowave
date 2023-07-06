import React, {
  createContext, useCallback, useContext, useEffect,
} from 'react';
import { Root, createRoot } from 'react-dom/client';

import { IGame, IScene } from '~type/game';

export const GameContext = createContext<IGame>(null);
const gameUI = document.getElementById('game-ui');

export function useWorldUpdate(callback: () => void, depends: any[] = []) {
  const game = useContext(GameContext);

  const safeCallback = useCallback(() => {
    try {
      callback();
    } catch (error) {
      console.error('Error on world update event:', error);
    }
  }, depends);

  useEffect(() => {
    safeCallback();

    game.world.events.on(Phaser.Scenes.Events.UPDATE, safeCallback);

    return () => {
      game.world.events.off(Phaser.Scenes.Events.UPDATE, safeCallback);
    };
  }, [safeCallback]);
}

export class Interface<T> {
  readonly container: HTMLDivElement;

  readonly root: Root;

  readonly scene: IScene;

  constructor(
    scene: IScene,
    Component: React.FC<T>,
    props?: T,
  ) {
    this.container = document.createElement('div');
    this.container.setAttribute('data-component', Component.displayName);
    gameUI.appendChild(this.container);

    this.root = createRoot(this.container);
    this.root.render(
      <GameContext.Provider value={scene.game}>
        <Component {...props} />
      </GameContext.Provider>,
    );

    this.scene = scene;
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  public destroy() {
    this.root.unmount();
    this.container.remove();
  }
}
