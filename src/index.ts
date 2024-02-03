import { checkScreenOrientation } from '~lib/screen';

import { Game } from './game';
import pkg from '../package.json';

window.GAME = new Game();

checkScreenOrientation();

console.clear();
console.log([
  `Created by ${pkg.author.name} / ${pkg.author.url}`,
  `Build v${pkg.version}`,
  `Open-Source at ${pkg.repository.url.replace('git+', '')}`,
].join('\n'));
