// NOTE(Braw): эти проверки ESLint были отключены, так как мешают или не несут
// никакой пользы в контексте этой функции.
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import type { Func } from "@common/types";

/**
 * Оборачивает синхронную в функцию в промис, который мгновенно разрешается с
 * выводом самой функции, при этом, если функция вернёт исключение, промис
 * будет отклонён.
 *
 * @param fc Функция, которую необходимо обернуть.
 * @return Обёрнутая функция.
 */
export function promisify<
  F extends Func,
  P extends Parameters<F>,
  R extends ReturnType<F>,
>(fc: F): (...args: P) => Promise<R> {
  // NOTE(Braw): используем обычные функции, чтобы не терять 'this'.
  const promisified = function (...args: P) {
    return new Promise<R>(function (resolve, reject) {
      try {
        resolve(fc(...args));
      } catch (err) {
        reject(err);
      }
    });
  };

  // NOTE(Braw): не знаю, следует ли вообще менять имя. Это может быть полезно
  // во время дебага.
  promisified.name = `${fc.name}$promisified`;

  return promisified;
}
