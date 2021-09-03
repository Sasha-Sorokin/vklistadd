import { Func } from "@common/types";
import { observe } from "@utils/dom";
import { useForceUpdate } from "@utils/hooks";
import {
	NotificationsTogglerHook,
	NotificationsHookState,
	INotificationsHookStateAvailable,
} from "../types/notifications";

type NotNull<T> = T extends null | undefined ? never : T;

/**
 * Представляет собой объединение ключей E, которые
 */
type HandlerProperties<E> = {
	[Key in keyof E]: NotNull<E[Key]> extends Func
		? unknown extends ThisParameterType<NotNull<E[Key]>>
			? never
			: GlobalEventHandlers extends ThisParameterType<NotNull<E[Key]>>
			? Key
			: never
		: never;
}[keyof E];

type Handlers<E> = { [Key in HandlerProperties<E>]: E[Key] };

/**
 * Находит в массиве элементе элемент, исходный код обработчика которого
 * содержит определённую строку
 *
 * @param elements Массив элементов для перебора
 * @param handlerName Название обработчика
 * @param search Искомая в коде обработчика строка
 * @return Элемент, обработчик `handlerName` которого содержит `search`
 */
export function findWithCallback<
	E extends Element,
	H extends Handlers<E>,
	K extends keyof H,
>(elements: E[], handlerName: K, search: string) {
	for (const element of elements) {
		const handler = element[handlerName as keyof E];

		if (typeof handler !== "function") continue;

		if (!handler.toString().includes(search)) continue;

		return element;
	}

	return null;
}

/**
 * Создаёт хук для использования переключателя уведомлений
 *
 * @param toggleElement Элемент переключателя для наблюдения за изменениями
 * @param readValue Функция для получения текущего значения переключателя
 * @param toggle Функция для переключения
 * @return Функция-хук для использования переключателя уведомлений
 */
export function createTogglerHook(
	toggleElement: HTMLElement,
	readValue: () => boolean,
	toggle: () => void,
): NotificationsTogglerHook {
	let isToggling = false;
	let lastReading = readValue();
	let forceUpdate: (() => void) | null = null;
	let currentCallback: (() => void) | null = null;
	let state: INotificationsHookStateAvailable | null = null;

	const disconnect = () => {
		if (currentCallback == null) return;

		observe(toggleElement).removeCallback(currentCallback);
	};

	let $toggle: () => void;

	const updateState = () => {
		state = {
			isAvailable: "yes",
			isToggling,
			isToggled: lastReading,
			toggle: $toggle,
			disconnect,
		};

		return state;
	};

	$toggle = () => {
		isToggling = true;

		updateState();

		forceUpdate?.();

		toggle();
	};

	const ensureBinding = () => {
		if (currentCallback != null) return;

		currentCallback = () => {
			const currentReading = readValue();

			if (lastReading === currentReading) return;

			lastReading = currentReading;

			isToggling = false;

			updateState();

			forceUpdate?.();
		};

		observe(toggleElement).addCallback(currentCallback);
	};

	return () => {
		forceUpdate = useForceUpdate();

		ensureBinding();

		return state ?? updateState();
	};
}

/**
 * Создаёт хук на случай, когда переключатель уведомлений недоступен
 *
 * @return Функция-хук, которая никогда не меняет своё состояние
 */
export function createDummyTogglerHook(): NotificationsTogglerHook {
	const state: NotificationsHookState = {
		isAvailable: "no",
		disconnect() {
			/* Not empty! */
		},
	};

	return () => state;
}
