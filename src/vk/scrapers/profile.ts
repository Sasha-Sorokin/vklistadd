import { elem, decodeDOMString, childrenOf } from "@utils/dom";
import { getContext } from "./utils";
import { findWithCallback, createTogglerHook } from "./utils/notifications";
import { NotificationsTogglerHook } from "./types/notifications";

/**
 * Представляет собой контекст страницы пользователя
 */
interface IProfileContext {
	/**
	 * Опции страницы
	 */
	options: {
		/**
		 * Ссылка на объект (пользователя)
		 */
		loc?: string;

		/**
		 * ID пользователя
		 */
		// eslint-disable-next-line @typescript-eslint/naming-convention
		user_id: number;

		/**
		 * Имя страницы для отображения на кнопке «Назад»
		 * (которую, кстати, ВКонтакте зачем-то скрыл)
		 */
		back: string;
	};
}

/**
 * @return Статус подписки на пользователя
 */
export function isFollowing(): boolean | null {
	const statusElement = elem("#friend_status");

	if (statusElement != null) {
		const addFrindButton = elem(".profile_action_btn", statusElement);

		if (addFrindButton != null) return false;

		const dropDownLabel = elem(".page_actions_dd_label", statusElement);

		if (dropDownLabel != null) return true;
	}

	return null;
}

/**
 * @return Является ли страница пользователя закрытой
 */
export function isPrivate(): boolean | null {
	// Весьма просто - смотрим, есть ли затворка
	return elem(".profile_closed_wall_dummy") != null;
}

/**
 * @return Ссылка на страницу пользователя
 */
export function getLink(): string | null {
	const ctx = getContext<IProfileContext>();

	const { loc, user_id: userId } = ctx.options;

	if (loc != null) return `/${loc}`;

	return `/id${userId}`;
}

/**
 * @return Принадлежит ли страница текущему пользователю
 */
export function isOwn(): boolean | null {
	const topProfileLink = elem<HTMLAnchorElement>(".top_profile_link");

	if (topProfileLink == null) return null;

	return getLink() === topProfileLink.getAttribute("href");
}

/**
 * @return Ссылка на аватарку страницы
 */
export function getIcon(): string | null {
	// 1. Попробуем достать аватарку из поста на стене

	const postImg = elem<HTMLImageElement>(".post.own img.post_img");

	if (postImg != null) return postImg.src;

	// 2. Если пользователь не публиковал постов, то ничего не остаётся
	//    кроме как взять его большую аватарку. Не очень красиво,
	//    но что есть :(

	const pageAvatarImg = elem<HTMLImageElement>("img.page_avatar_img");

	if (pageAvatarImg != null) return pageAvatarImg.src;

	return null;
}

/**
 * @return Имя страницы
 */
export function getName(): string | null {
	return decodeDOMString(getContext<IProfileContext>().options.back);
}

type Context = ReturnType<typeof getContext>;

type OptionalHook = NotificationsTogglerHook | null;

const NOTIFICATIONS_TOGGLERS = new WeakMap<Context, OptionalHook>();

/**
 * @return Переключатель уведомлений
 */
export function getNotificationsToggler(): OptionalHook {
	const context = getContext();

	let toggler = NOTIFICATIONS_TOGGLERS.get(context);

	if (toggler !== undefined) return null;

	const pageActions = childrenOf<HTMLElement>(elem(".page_actions_inner"));

	if (pageActions != null) {
		const action = findWithCallback(
			pageActions,
			"onclick",
			"Page.toggleSubscription",
		);

		if (action != null) {
			toggler = createTogglerHook(
				action,
				() => action.dataset.act === "0",
				() => action.click(),
			);
		}
	}

	toggler = toggler ?? null;

	NOTIFICATIONS_TOGGLERS.set(context, toggler);

	return toggler;
}
