import { useState, useCallback } from "preact/hooks";

/**
 * @return Функция для принудительного обновления компонента
 */
export function useForceUpdate() {
	let ret = useState(0);

	if ((ret as unknown) == null) {
		// иногда Preact багает и не возвращает нам useState?!
		ret = [0, () => 0];
	}

	const [, setTick] = ret;

	return useCallback(() => {
		setTick((tick) => tick + 1);
	}, [setTick]);
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
