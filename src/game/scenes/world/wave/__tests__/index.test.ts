import 'jest-canvas-mock';

import { Wave } from '..';
import type { WorldScene } from '../..';
import world from '../../__mocks__/world';
import { WAVE_ENEMIES_COUNT, WAVE_TIMELEFT, WAVE_TIMELEFT_GROWTH } from '../const';
import { WaveEvent } from '../types';

import { registerHelper } from './helpers/wave';

import { progressionLinear } from '~core/progression';
import { Tutorial } from '~core/tutorial';

describe('world / wave', () => {
  let wave: Wave;
  let helper: any;

  beforeAll(() => {
    Tutorial.Disable();
  });

  beforeEach(() => {
    world.getTime = jest.fn(() => 0);
    wave = new Wave(world as unknown as WorldScene);
    // @ts-ignore
    wave.createEnemy = jest.fn();
    wave.runTimeleft();
    helper = registerHelper(wave);
  });

  it('should return current wave number', () => {
    expect(wave.number).toEqual(1);

    helper.skipWaves(1);

    expect(wave.number).toEqual(2);
  });

  it('should return timeleft to wave start', () => {
    expect(wave.getTimeleft()).toEqual(WAVE_TIMELEFT);
  });

  it('should return timeleft to wave start after skip', () => {
    wave.skipTimeleft();

    expect(wave.getTimeleft()).toEqual(0);
  });

  it('should return timeleft to next wave start', () => {
    helper.skipWaves(1);

    expect(wave.getTimeleft()).toEqual(progressionLinear({
      defaultValue: WAVE_TIMELEFT,
      scale: WAVE_TIMELEFT_GROWTH,
      level: 2,
      roundTo: 1000,
    }));
  });

  it('should start wave when time is left', () => {
    wave.emit = jest.fn();
    helper.skipTime(wave.getTimeleft());
    wave.update();

    expect(wave.going).toEqual(true);
    // @ts-ignore
    expect(wave.enemiesMaxCount).toEqual(WAVE_ENEMIES_COUNT);
    expect(wave.emit).toHaveBeenCalledWith(WaveEvent.START, 1);
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

    expect(wave.going).toEqual(false);
    expect(wave.emit).toHaveBeenCalledWith(WaveEvent.COMPLETE, 1);
  });

  // it('should spawn boss on last wave of season', () => {
  //   helper.skipWaves(ENEMY_BOSS_SPAWN_WAVE_RATE - 1);

  //   // @ts-ignore
  //   wave.createEnemy.mockClear();

  //   helper.skipWaves(1);

  //   // @ts-ignore
  //   expect(wave.createEnemy).toHaveBeenNthCalledWith(1, EnemyVariant.BOSS);
  // });
});
