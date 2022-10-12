import assert from 'assert';

import { Live } from '../live';

let live: Live;

describe('live.ts', () => {
  before(() => {
    live = new Live(100);
  });

  it('should set default max health by health', () => {
    assert.equal(live.maxHealth, live.health);
  });

  it('should take gamage', () => {
    live.damage(10);
    assert.equal(live.isMaxHealth(), false);
    assert.equal(live.health, 90);
  });

  it('should reestablish health', () => {
    live.heal();
    assert.equal(live.isMaxHealth(), true);
  });

  it('should dead', () => {
    live.damage(999);
    assert.equal(live.isDead(), true);
    assert.equal(live.health, 0);
  });
});
