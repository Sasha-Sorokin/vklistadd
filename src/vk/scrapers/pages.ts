import { elem, childrenOf } from "@utils/dom";
import { getContext } from "./utils";
import { SupportedModule } from "./types";
import { findWithCallback, createTogglerHook } from "./utils/notifications";
import { NotificationsTogglerHook } from "./types/notifications";

/**
 * Представляет собой контекст страницы паблика
 */
interface IPublicContext {
	/**
	 * Опции страницы
	 */
	options: {
		/**
		 * Подписан ли текущий пользователь на паблик
		 */
		liked: boolean;

		/**
		 * Ссылка на паблик
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		public_link: string;
	};
}

/**
 * Представляет собой контекст страницы группы
 */
interface IGroupContext {
	/**
	 * Опции страницы
	 */
	options: {
		/**
		 * Ссылка на объект (группу)
		 */
		loc?: string;

		/**
		 * ID группы
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		group_id: number;
	};
}

/**
 * @return Статус подписки на группу/паблик
 */
export function isFollowing(): boolean | null {
	const { module } = getContext();

	switch (module) {
		case SupportedModule.Public: {
			return getContext<IPublicContext>().options.liked;
		}

		case SupportedModule.Group: {
			return elem(".page_actions_btn") != null;
		}

		default:
			return null;
	}
}

/**
 * @return Статус закрытости группы
 */
export function isPrivate(): boolean | null {
	// Смотрим на сообщение о закрытости группы
	return elem(".group_closed") != null;
}

/**
 * @return Ссылка на группу/паблик
 */
export function getLink(): string | null {
	const { module } = getContext();

	switch (module) {
		case SupportedModule.Public: {
			return getContext<IPublicContext>().options.public_link;
		}

		case SupportedModule.Group: {
			const {
				options: { loc, group_id: groupId },
			} = getContext<IGroupContext>();

			if (loc != null) return `/${loc}`;

			return `/club${groupId}`;
		}

		default:
			return null;
	}
}

/**
 * @return Ссылка на иконку группы/паблика
 */
export function getIcon(): string | null {
	// 1. Попытаемся забрать аватарку из шапки

	const coverAvatar = elem<HTMLImageElement>(
		".page_cover_image img.post_img",
	);

	if (coverAvatar != null) return coverAvatar.src;

	// 2. Ищем пост от имени группы / паблика

	const postAvatar = elem<HTMLImageElement>(".post.own img.post_img");

	if (postAvatar != null) return postAvatar.src;

	// 3. Если не получилось, пробуем метод для групп

	const pageAvatar = elem<HTMLImageElement>(
		".page_avatar img.page_avatar_img",
	);

	if (pageAvatar != null) return pageAvatar.src;

	// 4. Чтош

	return null;
}

/**
 * @return Название группы/паблика
 */
export function getName(): string | null {
	return elem<HTMLHeadingElement>("h1.page_name")?.textContent ?? null;
}

type Context = ReturnType<typeof getContext>;

type OptionalToggler = NotificationsTogglerHook | null;

const NOTIFICATIONS_TOGGLERS = new WeakMap<Context, OptionalToggler>();

/**
 * @return Переключатель уведомлений
 */
export function getNotificationsToggler(): NotificationsTogglerHook | null {
	const context = getContext();

	let toggler = NOTIFICATIONS_TOGGLERS.get(context);

	if (toggler !== undefined) return null;

	const pageActions = childrenOf<HTMLElement>(elem(".page_actions_expanded"));

	if (pageActions != null) {
		const action = findWithCallback(
			pageActions,
			"onclick",
			"Page.onSubscriptionItemOnClick",
		);

		if (action != null) {
			toggler = createTogglerHook(
				action,
				() => action.classList.contains("on"),
				() => action.click(),
			);
		}
	}

	toggler = toggler ?? null;

	NOTIFICATIONS_TOGGLERS.set(context, toggler);

	return toggler;
}
