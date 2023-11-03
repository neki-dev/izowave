import { useGame, useScene } from 'phaser-react-ui';
import React, { useEffect, useState } from 'react';

import { phrase } from '~lib/lang';
import { SDK } from '~lib/sdk';
import { Tutorial } from '~lib/tutorial';
import { Button } from '~scene/system/interface/button';
import { Hint } from '~scene/system/interface/hint';
import { GameScene, IGame } from '~type/game';
import { SDKAdsType } from '~type/sdk';
import { TutorialStep } from '~type/tutorial';
import { IWorld } from '~type/world';

import { Modal } from './modal';
import { Wrapper } from './styles';

export const Skills: React.FC = () => {
  const game = useGame<IGame>();
  const world = useScene<IWorld>(GameScene.WORLD);

  const [isOpened, setOpened] = useState(false);
  const [hint, setHint] = useState(false);

  const onClick = () => {
    Tutorial.Complete(TutorialStep.UPGRADE_SKILL);
    setOpened(true);
    game.toggleSystemPause(true);
  };

  const onClose = () => {
    const close = () => {
      setOpened(false);
      game.toggleSystemPause(false);
    };

    if (world.wave.number >= 4) {
      SDK.ShowAds(SDKAdsType.MIDGAME).then(close);
    } else {
      close();
    }
  };

  useEffect(() => (
    Tutorial.Bind(TutorialStep.UPGRADE_SKILL, {
      beg: () => setHint(true),
      end: () => setHint(false),
    })
  ), []);

  return (
    <>
      {isOpened && <Modal onClose={onClose} />}
      <Wrapper>
        <Button onClick={onClick} view={isOpened ? 'confirm' : undefined}>
          {phrase('SKILLS')}
        </Button>
        {hint && (
          <Hint label='TUTORIAL_CLICK_TO_UPGRADE' side="top" />
        )}
      </Wrapper>
    </>
  );
};
