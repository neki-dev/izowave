export function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any;
}

export function keys<T>(obj: T): Keys<T> {
  return Object.keys(obj) as any;
}
