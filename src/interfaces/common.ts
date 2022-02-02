export interface Res<T> {
  code: 0 | 1 | 2;
  data: T;
}
