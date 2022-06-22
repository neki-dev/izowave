declare global {
  interface Window {
    cheat: (code: string) => void;
  }
}

const scheme = {
  _current: {},
};

function setCheatsScheme(data: {
  [code in string]: () => void
}) {
  scheme._current = data;
}

window.cheat = (code: string) => {
  scheme._current[code]?.();
};

export default setCheatsScheme;
