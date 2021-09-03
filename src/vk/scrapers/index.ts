import { Nullable } from "@common/types";
import { ITreating, SupportedModule } from "./types";
import * as alternative from "./alternative";
import { getContext } from "./utils";
import * as profile from "./profile";
import * as pages from "./pages";
import { NotificationsTogglerHook } from "./types/notifications";
import { createDummyTogglerHook } from "./utils/notifications";

//
// Добро пожаловать в сборник хаков для самых маленьких!
//

export * from "./types";

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Ссылка на объект
 */
export function getLink(altTreating?: ITreating): string | null {
	if (altTreating != null) return alternative.getLink(altTreating);

	if (getContext().module === SupportedModule.Profile) {
		return profile.getLink();
	}

	return pages.getLink();
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Ссылка на иконку объекта
 */
export function getIcon(altTreating?: ITreating): string | null {
	if (altTreating != null) return alternative.getIcon(altTreating);

	if (getContext().module === SupportedModule.Profile) {
		return profile.getIcon();
	}

	return pages.getIcon();
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Название/имя объекта
 */
export function getName(altTreating?: ITreating): string | null {
	if (altTreating != null) return alternative.getName(altTreating);

	if (getContext().module === SupportedModule.Profile) {
		return profile.getName();
	}

	return pages.getName();
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Статус подписки на объект
 */
export function isFollowing(altTreating?: ITreating): boolean | null {
	if (altTreating != null) return alternative.isFollowing(altTreating);

	if (getContext().module === SupportedModule.Profile) {
		return profile.isFollowing();
	}

	return pages.isFollowing();
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Статус приватности объекта
 */
export function isPrivate(altTreating?: ITreating): boolean | null {
	if (altTreating != null) return false;

	const { module } = getContext();

	switch (module) {
		case SupportedModule.Public: {
			// "паблики" по определению не могут быть закрытыми
			return true;
		}

		case SupportedModule.Profile: {
			return profile.isPrivate();
		}

		default: {
			return pages.isPrivate();
		}
	}
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return ID объекта
 */
export function getID(altTreating?: ITreating) {
	if (altTreating != null) return alternative.getID(altTreating);

	return getContext().oid;
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Принадлежит ли объект текущему пользователю
 */
export function isOwn(altTreating?: ITreating) {
	if (altTreating != null) return null;

	switch (getContext().module) {
		case SupportedModule.Profile:
			return profile.isOwn();

		default:
			return null;
	}
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Тип объекта
 */
export function getType(altTreating?: ITreating): SupportedModule | null {
	if (altTreating != null) return alternative.getType(altTreating);

	const { module } = getContext();

	switch (module) {
		case SupportedModule.Profile:
		case SupportedModule.Group:
		case SupportedModule.Public: {
			return module as SupportedModule;
		}

		default:
			return null;
	}
}

/**
 * @param altTreating Информация об альтернативном элементе
 * @return Переключатель уведомлений
 */
export function getNotificationsToggler(altTreating?: ITreating) {
	if (altTreating != null) {
		return alternative.getNotificationsToggler(altTreating);
	}

	switch (getContext().module) {
		case SupportedModule.Public:
		case SupportedModule.Group: {
			return pages.getNotificationsToggler();
		}

		case SupportedModule.Profile: {
			return profile.getNotificationsToggler();
		}

		default:
			return null;
	}
}

/**
 * Представляет собой отображаемую информацию о паблике,
 * группе или пользователе
 */
export interface IFullContext {
	/**
	 * Тип объекта
	 */
	type: SupportedModule;

	/**
	 * ID объекта
	 */
	id: number;

	/**
	 * Отображаемое имя объекта
	 */
	name: string;

	/**
	 * Ссылка на аватарку объекта
	 */
	icon: string;

	/**
	 * Ссылка на объект
	 */
	link: string;

	/**
	 * Это приватный объект
	 */
	isPrivate: boolean;

	/**
	 * Текущий пользователь подписан на этот объект
	 */
	isFollowed: boolean;

	/**
	 * Страница принадлежит текущему пользователю
	 */
	isOwn: boolean;

	/**
	 * Элемент переключения уведомлений
	 */
	useNotifications: NotificationsTogglerHook;
}

/**
 * Представляет собой неполный контекст
 */
export type PartialContext = Nullable<
	Pick<IFullContext, keyof Omit<IFullContext, "useNotifications">>
> &
	Pick<IFullContext, "useNotifications">;

/**
 * @param altTreating Информация об элементе, для которого нужно получить
 * информацию
 * @return Вся информация о текущем паблике, группе или пользователе из
 * контекста страница
 */
export function getFullContext(altTreating?: ITreating): PartialContext {
	const useNotifications =
		getNotificationsToggler(altTreating) ?? createDummyTogglerHook();

	return {
		type: getType(altTreating),
		id: getID(altTreating),
		name: getName(altTreating),
		icon: getIcon(altTreating),
		link: getLink(altTreating),
		isPrivate: isPrivate(altTreating),
		isFollowed: isFollowing(altTreating),
		isOwn: isOwn(altTreating),
		useNotifications,
	};
}
