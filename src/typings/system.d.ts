type Nullable<T> = T | null;

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][];

type Keys<T> = (keyof T)[];
