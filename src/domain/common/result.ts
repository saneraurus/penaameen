export type Success<T> = {
  readonly ok: true;
  readonly value: T;
};

export type Failure<E> = {
  readonly ok: false;
  readonly error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export function succeed<T>(value: T): Success<T> {
  return { ok: true, value };
}

export function fail<E>(error: E): Failure<E> {
  return { ok: false, error };
}
