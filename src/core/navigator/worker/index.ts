/* eslint-disable no-restricted-globals */
/* eslint-disable no-case-declarations */

import { NavigatorEvent } from '../types';
import type { NavigatorPayloadCancelTask, NavigatorPayloadCreateTask, NavigatorPayloadUpdatePointCost } from '../types';

import { NavigatorProcess } from './process';
import { NavigatorTask } from './task';

const navigatorProcess = new NavigatorProcess();

setInterval(() => {
  navigatorProcess.processing();
}, 100);

self.onmessage = ({ data }) => {
  switch (data.event) {
    case NavigatorEvent.CREATE_TASK: {
      const payload = data.payload as NavigatorPayloadCreateTask;
      const task = new NavigatorTask(payload);

      navigatorProcess.createTask(task);
      break;
    }
    case NavigatorEvent.CANCEL_TASK: {
      const payload = data.payload as NavigatorPayloadCancelTask;

      navigatorProcess.cancelTask(payload.id);
      break;
    }
    case NavigatorEvent.UPDATE_POINT_COST: {
      const payload = data.payload as NavigatorPayloadUpdatePointCost;

      navigatorProcess.setPointCost(payload.position, payload.cost);
      break;
    }
  }
};
