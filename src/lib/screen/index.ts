function matchMediaHandler(event?: MediaQueryListEvent) {
  let overlay = document.getElementById('invalid-screen');
  const isLandscape = event ? event.matches : window.innerWidth >= window.innerHeight;

  if (isLandscape) {
    if (overlay) {
      overlay.remove();
    }
  } else if (!overlay) {
    overlay = document.createElement('div');

    overlay.id = 'invalid-screen';
    overlay.innerText = 'TURN PHONE TO LANDSCAPE ORIENTATION';

    document.body.append(overlay);
  }
}

export function checkScreenOrientation() {
  matchMediaHandler();
  window.matchMedia('(orientation: landscape)')
    .addEventListener('change', matchMediaHandler);
}
