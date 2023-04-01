import { PerformanceLevel } from '~type/optimize';

export function getPerformance() {
  // @ts-ignore
  const maxMem = Math.round((window.performance?.memory?.jsHeapSizeLimit || 0) / 1024 / 1024 / 1024);

  if (maxMem <= 1) {
    return PerformanceLevel.LOW;
  } if (maxMem <= 4) {
    return PerformanceLevel.MEDIUM;
  }

  return PerformanceLevel.HIGH;
}
