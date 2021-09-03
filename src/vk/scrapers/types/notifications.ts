/**
 * Статус уведомлений
 */
export const enum NotificationsStatus {
	/**
	 * Переключение и статус уведомлений не доступны в этом контексте
	 */
	Unavailable = "unavailable",

	/**
	 * Уведомления включены
	 */
	Enabled = "enabled",

	/**
	 * Уведомления отключены
	 */
	Disabled = "disabled",
}

/**
 * Представляет собой «доступное» состояние хука для переключателя
 */
export interface INotificationsHookStateAvailable {
	/**
	 * Доступен ли переключатель
	 */
	isAvailable: "yes";

	/**
	 * Меняется ли состояние в настроящий момент
	 *
	 * Если `true`, следует показать индикатор прогресса
	 */
	isToggling: boolean;

	/**
	 * Включены ли уведомления
	 */
	isToggled: boolean;

	/**
	 * Переключает статус подписки на уведомления
	 */
	toggle(this: void): void;

	/**
	 * Функция для отключения наблюдения за обновлениями переключателя
	 */
	disconnect(this: void): void;
}

/**
 * Представляет собой «недоступное» состояние хука для переключателя
 */
export interface INotificationsHookStateUnavalable {
	/**
	 * Доступен ли переключатель
	 */
	isAvailable: "no";

	/**
	 * Функция для отключения наблюдения за обновлениями переключателя
	 */
	disconnect(): void;
}

export type NotificationsHookState =
	| INotificationsHookStateAvailable
	| INotificationsHookStateUnavalable;

export type NotificationsTogglerHook = () => NotificationsHookState;
