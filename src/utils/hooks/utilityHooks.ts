import { useCallback, useState } from "@external/preact/hooks";
import { log } from "@utils/debug";

/**
 * @return Функция для принудительного обновления компонента
 */
export function useForceUpdate() {
  let ret = useState({});

  if (!Array.isArray(ret)) {
    // NOTE(Braw): иногда Preact багает и не возвращает нам useState?!

    log("error", "useForceUpdate(): illegal return, fix up", ret);

    ret = [{}, () => undefined];
  }

  const [, setTick] = ret;

  return useCallback(() => setTick({}), [setTick]);
}

/**
 * Хук для использования обработчика события и автоматической отмены
 * действия по умолчанию для элемента
 *
 * @param callback Обработчик события
 * @return Обработчик, который можно использовать для событий
 */
export function usePreventedCallback<E extends Event>(
  callback?: ((event: E) => void) | null,
) {
  return useCallback(
    (event: E) => {
      event.preventDefault();

      callback?.(event);

      return false;
    },
    [callback],
  );
}
