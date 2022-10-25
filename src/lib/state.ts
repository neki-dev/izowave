import { FailureType } from '~type/core';

export function throwFailure(type: FailureType) {
  if (document.getElementById(`failure-${type}`)) {
    return;
  }

  const overlay = document.createElement('div');

  overlay.classList.add('overlay');
  overlay.id = `failure-${type}`;

  switch (type) {
    case FailureType.BAD_DEVICE:
      overlay.innerText = 'DEVICE IS NOT SUPPORTED';
      break;
    case FailureType.BAD_SCREEN_SIZE:
      overlay.innerText = 'SCREEN SIZE IS NOT SUPPORTED';
      break;
    case FailureType.UNCAUGHT_ERROR:
      overlay.innerText = 'UNCAUGHT ERROR';
      break;
    default:
      break;
  }

  document.body.prepend(overlay);
}

export function removeFailure(type: FailureType) {
  const overlay = document.getElementById(`failure-${type}`);

  if (overlay) {
    overlay.remove();
  }
}

export function setLoadingStatus(text: string) {
  const status = document.getElementById('loading-status');

  if (status) {
    status.innerText = text;
  }
}

export function removeLoading() {
  const overlay = document.getElementById('loading');

  if (overlay) {
    overlay.remove();
  }
}
