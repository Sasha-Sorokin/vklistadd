import { format } from "util";

export class AssertError extends Error {}

/**
 * Проверяет, что аргумент condition содержит значение true, и если это не так,
 * выбрасывает исключение {@link AssertError} с сообщением подготовленным через
 * {@link format} функцию.s
 *
 * @param condition Результат условия.
 * @param fmt Сообщение для функции {@link format}
 * @param fmtParams Дополнительные аргументы для функции.
 * @see format Для информации о том, как работает format функция.
 */
export function assert(
  condition: boolean,
  fmt?: unknown,
  ...fmtParams: unknown[]
): asserts condition {
  if (!condition) {
    throw new AssertError(format(fmt, ...fmtParams));
  }
}

/**
 * Проверяет, что переданное значение удовлетворяет условие `value != null`, и
 * если это не так, выбрасывает исключение {@link AssertError} с сообщением,
 * подготовленным через {@link format} функцию.
 *
 * @param value Значение для проверки.
 * @param _fmt Сообщение для функции {@link format}.
 * @param _fmtParams Дополнительные аргументы для функции {@link format}.
 */
export function assertNotNull<T>(
  value: T,
  _fmt?: unknown,
  ..._fmtParams: unknown[]
): asserts value is NonNullable<T> {
  let fmt = _fmt;
  let fmtParams = _fmtParams;

  if (fmt == null) {
    fmt = "value does not satisfy condition `value != null`: %o";
    fmtParams = [value];
  }

  assert(value != null, fmt, ...fmtParams);
}
