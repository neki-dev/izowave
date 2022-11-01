import { AnalyticEvent } from '~type/analytics';

const DATA: {
  userId: string
} = {
  userId: null,
};

function generateUserId() {
  return String.fromCharCode(97 + Math.round(Math.random() * 10)) + Date.now();
}

export function trackAnalytic(event: AnalyticEvent, parameters: {
  [param in string]: number | string
}) {
  if (!DATA.userId) {
    return;
  }

  const payload = {
    event,
    userId: DATA.userId,
    parameters,
  };

  // TODO: Send event to analytics server

  if (IS_DEV_MODE) {
    console.log('track analytic event:', payload);
  }
}

export function initAnalytics() {
  DATA.userId = localStorage.getItem('userId');
  if (!DATA.userId) {
    DATA.userId = generateUserId();
    localStorage.setItem('userId', DATA.userId);
  }
}
