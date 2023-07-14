import 'jest-canvas-mock';

import { DIFFICULTY } from '~const/world/difficulty';
import { WAVE_TIMELEFT_ALARM } from '~const/world/wave';
import { progressionLinear } from '~lib/utils';
import { IWorld } from '~type/world';
import { EnemyVariant } from '~type/world/entities/npc/enemy';
import { IWave, WaveEvents } from '~type/world/wave';

import { registerHelper } from './helpers/wave';
import world from '../__mocks__/world';
import { Wave } from '../wave';

describe('wave.ts', () => {
  let wave: IWave;
  let helper: any;

  beforeEach(() => {
    world.getTime = jest.fn(() => 0);
    wave = new Wave(world as unknown as IWorld);
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
    // @ts-ignore
    wave.skipTimeleft();

    expect(wave.getTimeleft()).toEqual(WAVE_TIMELEFT_ALARM);
  });

  it('should return timeleft to next wave start', () => {
    helper.skipWaves(1);

    expect(wave.getTimeleft()).toEqual(progressionLinear(
      DIFFICULTY.WAVE_TIMELEFT,
      DIFFICULTY.WAVE_TIMELEFT_GROWTH,
      2,
      1000,
    ));
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
    helper.skipWaves(DIFFICULTY.WAVE_SEASON_LENGTH - 1);

    world.spawnEnemy.mockClear();

    helper.skipWaves(1);

    expect(world.spawnEnemy).toHaveBeenNthCalledWith(1, EnemyVariant.BOSS);
  });
});
