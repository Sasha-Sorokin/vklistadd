import type { Func } from "../common/types";

type CompareFunction = (a: unknown[], b: unknown[]) => boolean;

/**
 * Проверяет если два переданных массива поверхностно одинаковы.
 *
 * @param a Массив 1.
 * @param b Массив 2.
 * @return `true`, если массивы поверхностно одинаковы, иначе `false`.
 */
export function quickCompare(a: unknown[], b: unknown[]) {
  const len = a.length;

  if (a !== b || len !== b.length) return false;

  for (let i = 0; i < len; i += 1) {
    if (!Object.is(a[i], b[i])) return false;
  }

  return true;
}

/**
 * Создаёт функцию, которая при первом вызове вызывает переданную функцию `ret`
 * и сохраняет значение, которое она вернула; при последующих же вызовах,
 * возвращает ранее сохранённое значение.
 *
 * @param ret Функция, возвращающая значение.
 * @param comparator Функция, сравнивающая переданные параметры.
 * @param compareThis Следует ли сравнивать значение this.
 * @return Фукция, возвращающая сохранённое значение.
 */
export function memo<F extends Func>(
  ret: F,
  comparator: CompareFunction = quickCompare,
  compareThis = false,
): (this: unknown, ...args: Parameters<F>) => ReturnType<F> {
  let memoized: {
    value: ReturnType<F>;
    args: unknown[];
    this: unknown;
  } | null = null;

  return function $memoized(this: unknown, ...args: Parameters<F>) {
    if (
      memoized == null ||
      !comparator(memoized.args, args) ||
      (compareThis && this !== memoized.this)
    ) {
      memoized = {
        value: ret(...args),
        args,
        this: compareThis ? undefined : this,
      };
    }

    return memoized.value;
  };
}
