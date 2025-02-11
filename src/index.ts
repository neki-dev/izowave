import pkg from '../package.json';

import { Game } from './game';

import { checkScreenOrientation } from '~lib/screen';

window.GAME = new Game();

checkScreenOrientation();

console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Build v${pkg.version}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));
