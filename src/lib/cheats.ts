import { CheatsScheme } from '~type/cheats';

export function setCheatsScheme(data: CheatsScheme) {
  for (const [cheat, callback] of Object.entries(data)) {
    window[cheat] = () => {
      callback();
      return 'Cheat activated';
    };
  }
}
