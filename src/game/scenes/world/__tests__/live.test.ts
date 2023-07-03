import { Live } from '../live';

describe('live.ts', () => {
  let live: Live;

  beforeEach(() => {
    live = new Live(100);
  });

  it('should set default max health by health', () => {
    expect(live.maxHealth).toEqual(live.health);
  });

  it('should take gamage', () => {
    live.damage(10);

    expect(live.isMaxHealth()).toEqual(false);
    expect(live.health).toEqual(90);
  });

  it('should reestablish health', () => {
    live.heal();

    expect(live.isMaxHealth()).toEqual(true);
  });

  it('should dead after damage', () => {
    live.damage(999);

    expect(live.isDead()).toEqual(true);
    expect(live.health).toEqual(0);
  });

  it('should dead after kill', () => {
    live.heal();
    live.kill();

    expect(live.isDead()).toEqual(true);
    expect(live.health).toEqual(0);
  });
});
