import { useState, useCallback, useContext } from "preact/hooks";
import { BoxContext } from "@components/contexts/boxContext";
import { TargetContext } from "@components/contexts/targetContext";
import { TranslationContext } from "@components/contexts/translationContext";

/**
 * Хук для использования текущего объекта из контекста
 *
 * @returns Текущий объект, для которого создан бокс
 */
export function useTarget() {
	return useContext(TargetContext);
}

/**
 * Хук для использования текущего контекста бокса
 *
 * @returns Текущий контекст бокса
 */
export function useBoxDetail() {
	return useContext(BoxContext);
}

/**
 * Хук для использование основных контекстов бокса (кроме переводов)
 *
 * @returns Массив из: контекста бокса и текущем объекте
 */
export function useBoxContexts() {
	const detail = useBoxDetail();
	const target = useTarget();

	return [detail, target] as const;
}

/**
 * Алиас для `useContext(TranslationContext)`
 *
 * @returns Текущие переводы
 */
export function useTranslations() {
	return useContext(TranslationContext);
}

/**
 * Хук для использования конкретной ветви из контекста перевода
 *
 * @param tree Название ветви перевода
 * @returns Содержимое ветви
 */
export function useTranslation<Key extends keyof ITranslation>(tree: Key) {
	const translation = useTranslations();

	return translation[tree];
}

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
