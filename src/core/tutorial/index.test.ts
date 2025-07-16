import { TutorialStep } from './types';

import { Tutorial } from '.';

describe('lib / tutorial', () => {
  beforeEach(() => {
    Tutorial.Reset();
  });

  it('should emit step by step', () => {
    const callbackBeg = jest.fn();
    const callbackEnd = jest.fn();

    Tutorial.Bind(TutorialStep.BUILD_TOWER_FIRE, {
      beg: callbackBeg,
      end: callbackEnd,
    });

    Tutorial.Start(TutorialStep.BUILD_TOWER_FIRE);

    expect(callbackBeg).toBeCalled();
    expect(callbackEnd).not.toBeCalled();

    Tutorial.Complete(TutorialStep.BUILD_TOWER_FIRE);

    expect(callbackEnd).toBeCalled();
  });

  it('should emit only unique events', () => {
    const callbackBeg = jest.fn();

    Tutorial.Bind(TutorialStep.BUILD_TOWER_FIRE, {
      beg: callbackBeg,
    });

    Tutorial.Start(TutorialStep.BUILD_TOWER_FIRE);
    Tutorial.Start(TutorialStep.BUILD_TOWER_FIRE);

    expect(callbackBeg).toBeCalledTimes(1);
  });

  it('should emit from history', () => {
    const callbackBeg = jest.fn();
    const callbackBegAll = jest.fn();

    Tutorial.Start(TutorialStep.BUILD_TOWER_FIRE);

    Tutorial.Bind(TutorialStep.BUILD_TOWER_FIRE, {
      beg: callbackBeg,
    });

    Tutorial.BindAll({
      beg: callbackBegAll,
    });

    expect(callbackBeg).toBeCalledTimes(1);
    expect(callbackBegAll).toBeCalledTimes(1);
  });
});
