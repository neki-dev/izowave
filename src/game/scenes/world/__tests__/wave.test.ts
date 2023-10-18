import 'jest-canvas-mock';

import { DIFFICULTY } from '~const/world/difficulty';
import { ENEMY_BOSS_SPAWN_WAVE_RATE } from '~const/world/entities/enemy';
import { Tutorial } from '~lib/tutorial';
import { Analytics } from '~lib/analytics';
import { progressionLinear } from '~lib/progression';
import { IWorld } from '~type/world';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import { IWave, WaveEvents } from '~type/world/wave';

import { registerHelper } from './helpers/wave';
import world from '../__mocks__/world';
import { Wave } from '../wave';

describe('wave.ts', () => {
  let wave: IWave;
  let helper: any;

  beforeAll(() => {
    Tutorial.Disable();
    Analytics.TrackEvent = jest.fn();
  });

  beforeEach(() => {
    world.getTime = jest.fn(() => 0);
    wave = new Wave(world as unknown as IWorld);
    wave.runTimeleft();
    helper = registerHelper(wave);
  });

  it('should return current wave number', () => {
    expect(wave.number).toEqual(1);

    helper.skipWaves(1);

    expect(wave.number).toEqual(2);
  });

  it('should return timeleft to wave start', () => {
    expect(wave.getTimeleft()).toEqual(DIFFICULTY.WAVE_TIMELEFT);
  });

  it('should return timeleft to wave start after skip', () => {
    wave.skipTimeleft();

    expect(wave.getTimeleft()).toEqual(0);
  });

  it('should return timeleft to next wave start', () => {
    helper.skipWaves(1);

    expect(wave.getTimeleft()).toEqual(progressionLinear({
      defaultValue: DIFFICULTY.WAVE_TIMELEFT,
      scale: DIFFICULTY.WAVE_TIMELEFT_GROWTH,
      level: 2,
      roundTo: 1000,
    }));
  });

  it('should start wave when time is left', () => {
    wave.emit = jest.fn();
    helper.skipTime(wave.getTimeleft());
    wave.update();

    expect(wave.isGoing).toEqual(true);
    // @ts-ignore
    expect(wave.enemiesMaxCount).toEqual(DIFFICULTY.WAVE_ENEMIES_COUNT);
    expect(wave.emit).toBeCalledWith(WaveEvents.START, 1);
  });

  it('should spawn enemies', () => {
    helper.skipTime(wave.getTimeleft());
    wave.update();
    helper.spawnAllEnemies();

    // @ts-ignore
    expect(wave.getEnemiesLeft()).toEqual(wave.enemiesMaxCount);
  });

  it('should complete wave when all enemies is dead', () => {
    wave.emit = jest.fn();
    helper.skipTime(wave.getTimeleft());
    wave.update();
    helper.spawnAllEnemies();
    helper.killAllEnemies();
    wave.update();

    expect(wave.isGoing).toEqual(false);
    expect(wave.emit).toBeCalledWith(WaveEvents.COMPLETE, 1);
  });

  it('should spawn boss on last wave of season', () => {
    helper.skipWaves(ENEMY_BOSS_SPAWN_WAVE_RATE - 1);

    world.spawnEnemy.mockClear();

    helper.skipWaves(1);

    expect(world.spawnEnemy).toHaveBeenNthCalledWith(1, EnemyVariant.BOSS);
  });
});
