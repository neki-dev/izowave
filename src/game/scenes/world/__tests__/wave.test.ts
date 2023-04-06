import 'jest-canvas-mock';

import { DIFFICULTY } from '~const/world/difficulty';
import { WAVE_TIMELEFT_AFTER_SKIP } from '~const/world/wave';
import { calcGrowth } from '~lib/utils';

import world from '../__mocks__/world';
import { Wave } from '../wave';

describe('wave.ts', () => {
  let wave: Wave;

  beforeAll(() => {
    world.getTimerNow = jest.fn(() => 0);

    wave = new Wave(world);
  });

  it('should return current number', () => {
    expect(wave.getCurrentNumber()).toEqual(1);
  });

  it('should return timeleft to wave start', () => {
    expect(wave.getTimeleft()).toEqual(DIFFICULTY.WAVE_PAUSE);
  });

  it('should return timeleft to wave start after skip', () => {
    wave.skipTimeleft();

    expect(wave.getTimeleft()).toEqual(WAVE_TIMELEFT_AFTER_SKIP);
  });

  it('should start wave', async () => {
    world.getTimerNow = jest.fn(() => WAVE_TIMELEFT_AFTER_SKIP);

    wave.update();

    expect(wave.isGoing).toEqual(true);
    expect(wave.maxSpawnedCount).toEqual(DIFFICULTY.WAVE_ENEMIES_COUNT);
  });

  it('should spawn enemies', () => {
    const now = world.getTimerNow();

    for (let i = 0; i < wave.maxSpawnedCount; i++) {
      world.getTimerNow = jest.fn(() => (
        now + (i * DIFFICULTY.WAVE_ENEMIES_SPAWN_PAUSE)
      ));

      wave.update();

      world.entityGroups.enemies.getTotalUsed = jest.fn(() => (i + 1));
    }

    expect(wave.spawnedCount).toEqual(wave.maxSpawnedCount);
    expect(world.spawnEnemy).toBeCalledTimes(wave.maxSpawnedCount);
  });

  it('should complete wave', () => {
    world.entityGroups.enemies.getTotalUsed = jest.fn(() => 0);

    wave.update();

    expect(wave.isGoing).toEqual(false);
  });

  it('should return timeleft to next wave start', () => {
    expect(wave.getTimeleft()).toEqual(calcGrowth(
      DIFFICULTY.WAVE_PAUSE,
      DIFFICULTY.WAVE_PAUSE_GROWTH,
      wave.number + 1,
    ));
  });
});
