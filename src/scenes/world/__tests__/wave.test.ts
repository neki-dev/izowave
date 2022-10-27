import 'jest-canvas-mock';

import { DIFFICULTY } from '~const/difficulty';

import world from '../__mocks__/world';
import { Wave } from '../wave';

describe('wave.ts', () => {
  let wave: Wave;

  beforeAll(() => {
    world.getTimerNow = jest.fn(() => 0);

    wave = new Wave(world);
  });

  it('should return timeleft to wave start', () => {
    expect(wave.getTimeleft()).toEqual(DIFFICULTY.WAVE_PAUSE);
  });

  it('should return timeleft to wave start after skip', () => {
    wave.skipTimeleft();

    expect(wave.getTimeleft()).toEqual(3000);
  });

  it('should start wave', async () => {
    world.getTimerNow = jest.fn(() => 3000);

    wave.update();

    expect(wave.isGoing).toEqual(true);
    expect(wave.number).toEqual(1);
    expect(wave.maxSpawnedCount).toEqual(DIFFICULTY.WAVE_ENEMIES_COUNT);
  });

  it('should spawn enemies', () => {
    const now = world.getTimerNow();

    for (let i = 0; i < wave.maxSpawnedCount; i++) {
      world.getTimerNow = jest.fn(() => (
        now + (i * DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE)
      ));

      wave.update();

      world.enemies.getTotalUsed = jest.fn(() => (i + 1));
    }

    expect(wave.spawnedCount).toEqual(wave.maxSpawnedCount);
    expect(world.spawnEnemy).toBeCalledTimes(wave.maxSpawnedCount);
  });

  it('should complete wave', () => {
    world.enemies.getTotalUsed = jest.fn(() => 0);

    wave.update();

    expect(wave.isGoing).toEqual(false);
  });

  it('should return timeleft to next wave start', () => {
    expect(wave.getTimeleft()).toEqual(DIFFICULTY.WAVE_PAUSE + 1000);
  });
});
