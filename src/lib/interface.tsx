import React, { createContext, useContext, useEffect } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { IGame, IScene } from '~type/game';

export const GameContext = createContext<IGame>(null);
const gameUI = document.getElementById('game-ui');

export function useWorldUpdate(callback: () => void) {
  const game = useContext(GameContext);

  useEffect(() => {
    callback();

    game.world.events.on(Phaser.Scenes.Events.UPDATE, callback);

    return () => {
      game.world.events.off(Phaser.Scenes.Events.UPDATE, callback);
    };
  }, []);
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
    this.scene.events.on(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  public destroy() {
    this.root.unmount();
    this.container.remove();
  }
}
