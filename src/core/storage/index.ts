import { openDB } from 'idb';
import type { IDBPDatabase } from 'idb';

import type { StorageSave, StorageSavePayload } from './types';

import type { Game } from '~game/index';

export class Storage {
  private static DB: Nullable<IDBPDatabase> = null;

  public static Saves: StorageSave[] = [];

  public static async Register() {
    return openDB('save', 1, {
      upgrade: (db) => {
        if (!db.objectStoreNames.contains('save')) {
          db.createObjectStore('save', { keyPath: 'name' });
        }
      },
    })
      .then((db) => {
        this.DB = db;
      })
      .catch((error) => {
        console.error('Game storage error:', error);
      });
  }

  public static async LoadSaves() {
    if (!this.DB) {
      return Promise.resolve();
    }

    const transaction = this.DB.transaction('save', 'readonly');
    const store = transaction.objectStore('save');

    this.Saves = [];

    await store
      .getAll()
      .then((data: StorageSave[]) => {
        data.forEach((save) => {
          try {
            this.Saves.push({
              ...save,
              payload: JSON.parse(save.payload as unknown as string),
            });
          } catch {
            return null;
          }
        });

        this.Saves = this.Saves.sort((a, b) => b.date - a.date);
      })
      .catch((error) => {
        console.error('Game saves load error:', error);
      });
  }

  public static async DeleteSave(name: string) {
    if (!this.DB) {
      return Promise.resolve();
    }

    const transaction = this.DB.transaction('save', 'readwrite');
    const store = transaction.objectStore('save');

    await store.delete(name);

    const index = this.Saves.findIndex((save) => save.name === name);

    if (index !== -1) {
      this.Saves.splice(index, 1);
    }
  }

  public static async AddSave(game: Game, name: string) {
    if (!this.DB) {
      return Promise.resolve(null);
    }

    const transaction = this.DB.transaction('save', 'readwrite');
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

    const existIndex = this.Saves.findIndex((s) => s.name === name);

    if (existIndex !== -1) {
      await store.delete(name);
      this.Saves.splice(existIndex, 1);
    }

    return store
      .add({
        ...save,
        payload: JSON.stringify(payload),
      })
      .then(() => {
        this.Saves.unshift(save);

        return save;
      })
      .catch((error) => {
        console.error('Game save error:', error);

        return null;
      });
  }
}
