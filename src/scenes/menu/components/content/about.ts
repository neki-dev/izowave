import { INTERFACE_FONT } from '~const/interface';
import { Component } from '~lib/ui';

export const ComponentAbout = Component(function (container) {
  const about = this.add.text(0, -4, [
    'Your task is to survive as many waves as possible.',
    'With each wave, the number of enemies and their',
    'characteristics will grow.',
    '',
    'Between waves there are built walls to defend,',
    'towers to attack, mines to generation resources,',
    'and medics to replenish health.',
    '',
    'Also, do not forget to upgrade your buildings so',
    'as not to yield to enemies.',
  ], {
    fontSize: '17px',
    fontFamily: INTERFACE_FONT.MONOSPACE,
    // @ts-ignore
    lineSpacing: 6,
  });

  container.add(about);
});
