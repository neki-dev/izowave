/* eslint-disable no-restricted-globals */
/* eslint-disable no-case-declarations */
import { NavigatorEvent } from '~type/navigator';

import { NavigatorProcess } from './process';
import { NavigatorTask } from './task';

const navigatorProcess = new NavigatorProcess();

setInterval(() => {
  navigatorProcess.processing();
}, 100);

self.onmessage = ({ data }) => {
  switch (data.event) {
    case NavigatorEvent.CREATE_TASK:
      const task = new NavigatorTask(data.payload);

      navigatorProcess.createTask(task);
      break;

    case NavigatorEvent.CANCEL_TASK:
      navigatorProcess.cancelTask(data.payload.id);
      break;

    case NavigatorEvent.UPDATE_POINTS_COST:
      navigatorProcess.updatePointsCost(data.payload);
      break;
  }
};
