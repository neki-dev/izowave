import { openDB, IDBPDatabase } from 'idb';

import { IGame } from '~type/game';
import { IStorage, StorageSave, StorageSavePayload } from '~type/storage';

export class Storage implements IStorage {
  private db: Nullable<IDBPDatabase> = null;

  private _saves: StorageSave[] = [];

  public get saves() { return this._saves; }

  private set saves(v) { this._saves = v; }

  public async init() {
    return openDB('save', 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains('save')) {
          db.createObjectStore('save', { keyPath: 'name' });
        }
      },
    })
      .then((db) => {
        this.db = db;
      })
      .catch((error) => {
        console.error('Game storage error:', error);
      });
  }

  public async load() {
    if (!this.db) {
      return Promise.resolve();
    }

    const transaction = this.db.transaction('save', 'readonly');
    const store = transaction.objectStore('save');

    this.saves = [];

    await store
      .getAll()
      .then((data: StorageSave[]) => {
        data.forEach((save) => {
          try {
            this.saves.push({
              ...save,
              payload: JSON.parse(save.payload as unknown as string),
            });
          } catch (error) {
            return null;
          }
        });

        this.saves = this.saves.sort((a, b) => b.date - a.date);
      })
      .catch((error) => {
        console.error('Game saves load error:', error);
      });
  }

  public async delete(name: string) {
    if (!this.db) {
      return Promise.resolve();
    }

    const transaction = this.db.transaction('save', 'readwrite');
    const store = transaction.objectStore('save');

    await store.delete(name);

    const index = this.saves.findIndex((save) => save.name === name);

    if (index !== -1) {
      this.saves.splice(index, 1);
    }
  }

  public async save(game: IGame, name: string) {
    if (!this.db) {
      return Promise.resolve(null);
    }

    const transaction = this.db.transaction('save', 'readwrite');
    const store = transaction.objectStore('save');

    const payload: StorageSavePayload = {
      game: game.getSavePayload(),
      world: game.world.getSavePayload(),
      level: game.world.level.getSavePayload(),
      player: game.world.player.getSavePayload(),
      wave: game.world.wave.getSavePayload(),
    };

    const save: StorageSave = {
      name,
      payload,
      date: Date.now(),
    };

    const existIndex = this.saves.findIndex((s) => s.name === name);

    if (existIndex !== -1) {
      await store.delete(name);
      this.saves.splice(existIndex, 1);
    }

    return store
      .add({
        ...save,
        payload: JSON.stringify(payload),
      })
      .then(() => {
        this.saves.unshift(save);

        return save;
      })
      .catch((error) => {
        console.error('Game save error:', error);

        return null;
      });
  }
}
