let loadingScreen = document.getElementById('loading-screen');
const loadingAnimation = document.getElementById('loading-animation');
const loadingStatus = document.getElementById('loading-status');

export function setLoaderStatus(text: string) {
  if (loadingScreen) {
    loadingStatus.innerText = text;
  }
}

export function removeLoader() {
  if (loadingScreen) {
    loadingScreen.remove();
    loadingScreen = null;
  }
}

export function stopLoader() {
  if (loadingScreen) {
    loadingAnimation.remove();
  }
}
