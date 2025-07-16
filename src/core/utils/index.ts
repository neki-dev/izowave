export class Utils {
  /**
   * Get string hash.
   * @param value - Source string
   */
  static HashString(value: string) {
    return value
      .split('')
      .reduce((a, b) => {
        const h = (a << 5) - a + b.charCodeAt(0);

        return h & h;
      }, 0)
      .toString();
  }

  /**
   * Format timestamp to string time.
   * @param value - Timestamp in miliseconds
   */
  static FormatTime(value: number) {
    const m = Math.floor(value / 1000 / 60);
    const s = Math.ceil(value / 1000) % 60;

    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }

  /**
   * Add sign to amount.
   * @param value - Amount
   */
  static FormatAmount(value: number) {
    return `${value > 0 ? '+' : ''}${value}`;
  }

  /**
   * Get stage of period.
   * @param start - Start value
   * @param current - Current value
   */
  static GetStage(start: number, current: number) {
    let stage = 0;
    let next = start;

    for (let i = 1; i <= current; i++) {
      if (i === next) {
        stage++;
        next = i + stage;
      }
    }

    return stage;
  }

  /**
   * Each object entries.
   * @param obj - Object
   * @param callback - Callback
   */
  static EachObject<T extends Record<string, any>>(
    obj: T,
    callback: (key: keyof T, value: T[keyof T], index: number) => void,
  ) {
    Object.entries(obj).forEach(([key, value], index) => {
      callback(key, value, index);
    });
  }

  /**
   * Map object entries.
   * @param obj - Object
   * @param callback - Callback
   */
  static MapObject<T extends Record<string, any>, R>(
    obj: T,
    callback: (key: keyof T, value: T[keyof T], index: number) => R,
  ): R[] {
    return Object.entries(obj).map(([key, value], index) => (
      callback(key, value, index)
    ));
  }
}
