import cheats from '../__mocks__/cheats';
import { setCheatsScheme } from '../cheats';

describe('cheats.ts', () => {
  beforeAll(() => {
    setCheatsScheme(cheats);
  });

  it('should call cheat', () => {
    // @ts-ignore
    expect(window.TESTCHEAT()).toEqual('Cheat activated');
    expect(cheats.TESTCHEAT).toBeCalled();
  });
});
