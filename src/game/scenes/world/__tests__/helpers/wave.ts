import world from '../../__mocks__/world';
import { DIFFICULTY } from '~const/world/difficulty';
import { IWave } from '~type/world/wave';

export function registerHelper(wave: IWave) {
  return {
    startWave() {
      this.skipTime(wave.getTimeleft());
      wave.update();
    },

    spawnAllEnemies() {
      // @ts-ignore
      for (let i = 0; i < wave.enemiesMaxCount; i++) {
        const currentCount = world.entityGroups.enemy.getTotalUsed();

        this.skipTime(DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE);
        wave.update();
        world.entityGroups.enemy.getTotalUsed = jest.fn(() => currentCount + 1);
      }
    },

    killAllEnemies() {
      world.entityGroups.enemy.getTotalUsed = jest.fn(() => 0);
    },

    skipTime(ms: number) {
      const now = world.getTime();

      world.getTime = jest.fn(() => now + ms);
    },

    skipWaves(count: number) {
      for (let i = 0; i < count; i++) {
        this.skipTime(wave.getTimeleft());
        wave.update();
        this.spawnAllEnemies();
        this.killAllEnemies();
        wave.update();
      }
    },
  };
}
