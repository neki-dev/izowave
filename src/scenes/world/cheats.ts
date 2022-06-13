const scheme = {
  _current: {},
};

function setCheatsScheme(data: {
  [code in string]: () => void
}) {
  scheme._current = data;
}

// @ts-ignore
window.cheat = (code: string) => {
  scheme._current[code]?.();
};

export default setCheatsScheme;
