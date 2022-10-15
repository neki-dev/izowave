type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][];

export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}

type Keys<T> = (keyof T)[];

export function keys<T>(obj: T): Keys<T> {
  return Object.keys(obj) as any;
}
