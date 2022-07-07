export default function setCheatsScheme(data: {
  [code in string]: () => void
}) {
  for (const [cheat, callback] of Object.entries(data)) {
    window[cheat] = () => {
      callback();
      return 'Cheat activated';
    };
  }
}
