import { useContext } from "preact/hooks";
import { TargetContext } from "@components/contexts/TargetContext";
import { BoxContext } from "@components/contexts/BoxContext";
import { TranslationContext } from "@components/contexts/TranslationContext";

/**
 * Хук для использования текущего объекта из контекста
 *
 * @return Текущий объект, для которого создан бокс
 */
export function useTarget() {
	return useContext(TargetContext);
}

/**
 * Хук для использования текущего контекста бокса
 *
 * @return Текущий контекст бокса
 */
export function useBoxDetail() {
	return useContext(BoxContext);
}

/**
 * Хук для использование основных контекстов бокса (кроме переводов)
 *
 * @return Массив из: контекста бокса и текущем объекте
 */
export function useBoxContexts() {
	const detail = useBoxDetail();
	const target = useTarget();

	return [detail, target] as const;
}

/**
 * Алиас для `useContext(TranslationContext)`
 *
 * @return Текущие переводы
 */
export function useTranslations() {
	return useContext(TranslationContext);
}

/**
 * Хук для использования конкретной ветви из контекста перевода
 *
 * @param tree Название ветви перевода
 * @return Содержимое ветви
 */
export function useTranslation<Key extends keyof ITranslation>(tree: Key) {
	const translation = useTranslations();

	return translation[tree];
}
