import { ANALYTICS_SERVER } from '~const/analytics';
import { AnalyticData } from '~type/analytics';

const DATA: {
  userId: string
} = {
  userId: null,
};

function generateUserId() {
  return String.fromCharCode(97 + Math.round(Math.random() * 10)) + Date.now();
}

export function trackProgressionEvent(data: AnalyticData) {
  if (!DATA.userId) {
    return;
  }

  const payload = {
    userId: DATA.userId,
    success: data.success,
    difficulty: data.world.difficultyType,
    waveNumber: data.world.wave.number,
    resources: data.world.player.resources,
    level: data.world.player.level,
  };

  if (IS_DEV_MODE) {
    console.log('Track analytic event:', payload);
  } else {
    fetch(`${ANALYTICS_SERVER}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }
}

export function initAnalytics() {
  DATA.userId = localStorage.getItem('USER_ID');
  if (!DATA.userId) {
    DATA.userId = generateUserId();
    localStorage.setItem('USER_ID', DATA.userId);
  }
}
