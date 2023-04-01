export function entries<T extends Record<string, any>>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}

export function eachEntries<T extends Record<string, any>>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T], index: number) => void,
) {
  entries(obj).forEach(([key, value], index) => {
    callback(key, value, index);
  });
}
