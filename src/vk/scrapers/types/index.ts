/**
 * Перечисление поддерживаемых модулей
 */
export const enum SupportedModule {
	/**
	 * Идентификатор модуля профиля
	 */
	Profile = "profile",

	/**
	 * Идентификатор модуля паблика
	 */
	Public = "public",

	/**
	 * Идентификатор модуля группы
	 */
	Group = "groups",
}

// #region Альтернативные элементы

/**
 * Тип элемента и обращения к нему
 */
export const enum TreatingKind {
	/**
	 * Текущий элемент — закладка
	 */
	Bookmark = "bookmark",

	/**
	 * Текущий элемент — одна из групп в списке
	 */
	GroupRow = "group_row",

	/**
	 * Текущий элемент — один из друзей в списке
	 */
	FriendRow = "friend_row",
}

/**
 * Представляет собой опции альтернативного использования
 */
export interface ITreating {
	/**
	 * Тип элемента
	 */
	kind: TreatingKind;

	/**
	 * Элемент для объекта
	 */
	element: Element;

	/**
	 * Тип объекта для которого предназначается элемент
	 */
	subType?: SupportedModule;
}
