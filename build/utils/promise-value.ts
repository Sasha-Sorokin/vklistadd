export type ValueOrPromise<V> = V | PromiseLike<V>;
export type PromisedValue<V> = (this: unknown) => ValueOrPromise<V>;
export type Value<V> = V | PromisedValue<V>;
export type NonFunction<T> = T extends (
  this: unknown,
  ...args: unknown[]
) => unknown
  ? never
  : T;

/**
 * Принимает значение или функцию, возвращающую значение или
 * {@link PromiseLike}, который резольвится в значение, и возвращает итоговое
 * значение.
 *
 * Т.е. если переданное `value` это функция, выполняет эту функцию и, если её
 * результатом будет {@link PromiseLike}, резольвит его, иначе же возвращает
 * сам результат; в других же случаях, если `value` не функция, просто
 * возвращает это самое `value`.
 *
 * @param value Определение значения.
 * @return Значение.
 */
export async function promiseValue<V>(value: Value<V>) {
  return Promise.resolve(
    typeof value === "function" ? (value as PromisedValue<V>)() : value,
  );
}
