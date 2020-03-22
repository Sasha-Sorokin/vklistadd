import { useState, useCallback } from "preact/hooks";

/**
 * @returns Функция для принудительного обновления компонента
 */
export function useForceUpdate() {
	const [, setTick] = useState(0);

	return useCallback(() => {
		setTick((tick) => tick + 1);
	}, []);
}

/**
 * Хук для использования обработчика события и автоматической отмены
 * действия по умолчанию для элемента
 *
 * @param callback Обработчик события
 * @returns Обработчик, который можно использовать для событий
 */
export function usePreventedCallback<E extends Event>(
	callback?: ((event: E) => void) | null,
) {
	return useCallback((event: E) => {
		event.preventDefault();

		callback?.(event);

		return false;
	}, [callback]);
}
