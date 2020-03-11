import { elem, unwrapCSSValue, childrenOf } from "@utils/dom";
import { ITreating, TreatingKind, SupportedModule } from "./types";
import { findWithCallback, createTogglerHook } from "./utils/notifications";
import { NotificationsTogglerHook } from "./types/notifications";

/**
 * @param treating Информация об альтернативном элементе
 * @returns Статус подписки текущего пользователя на объект
 */
export function isFollowing(treating: ITreating): boolean | null {
	switch (treating.kind) {
		case TreatingKind.FriendRow:
		case TreatingKind.GroupRow: {
			// Науке не известно ни одного случая, в котором строчка
			// в списке подписок оказалась без подписки
			return true;
		}

		default: return null;
	}
}

const GROUP_ID = /gl_groups(\d+)/;
const FRIEND_ID = /friends_user_row(\d+)/;

/**
 * @param treating Информация об альтернативном элементе
 * @returns ID объекта внутри альтернативного элемента
 */
export function getID(treating: ITreating): number | null {
	const { element, kind } = treating;

	switch (kind) {
		case TreatingKind.FriendRow:
		case TreatingKind.GroupRow: {
			const regexp = kind === TreatingKind.GroupRow
				? GROUP_ID
				: FRIEND_ID;

			const id = regexp.exec(element.id)?.[1];

			if (id == null) return null;

			return kind === TreatingKind.GroupRow ? -+id : +id;
		}

		case TreatingKind.Bookmark: {
			const { id } = (element as HTMLDivElement).dataset;

			return id != null ? +id : null;
		}

		default: return null;
	}
}

/**
 * @param treating Информация об альтернативном элементе
 * @returns Ссылка на объект внутри альтернативного элемента
 */
export function getLink(treating: ITreating): string | null {
	const { element } = treating;

	switch (treating.kind) {
		case TreatingKind.GroupRow: {
			const link = elem("a.group_row_title", element);

			return (link as HTMLAnchorElement | null)?.href ?? null;
		}

		case TreatingKind.FriendRow: {
			const link = elem<HTMLAnchorElement>(
				".friends_field.friends_field_title > a",
				element,
			);

			return link?.href ?? null;
		}

		case TreatingKind.Bookmark: {
			const link = elem<HTMLAnchorElement>(
				".bookmark_page_item__name > a",
				element,
			);

			return link?.href ?? null;
		}

		default: return null;
	}
}

/**
 * @param treating Информация об альтернативном элементе
 * @returns Иконка для объекта внутри альтернативного элемента
 */
export function getIcon(treating: ITreating): string | null {
	const { element, kind } = treating;

	switch (kind) {
		case TreatingKind.FriendRow:
		case TreatingKind.GroupRow: {
			const icon = elem<HTMLImageElement>(
				kind === TreatingKind.GroupRow
					? ".group_row_img"
					: ".friends_photo_img",
				element,
			);

			return icon?.src ?? null;
		}

		case TreatingKind.Bookmark: {
			const icon = elem<HTMLDivElement>(
				".bookmark_page_item__image",
				element,
			);

			const url = icon?.style.backgroundImage?.slice(
				"url(".length,
				-")".length,
			);

			return url != null ? unwrapCSSValue(url) : null;
		}

		default: return null;
	}
}

/**
 * @param treating Информация об альтернативном элементе
 * @returns Название/имя объекта внутри альтернативного элемента
 */
export function getName(treating: ITreating): string | null {
	const { element } = treating;

	switch (treating.kind) {
		case TreatingKind.GroupRow: {
			const title = elem<HTMLAnchorElement>(
				"a.group_row_title",
				element,
			);

			return title?.textContent ?? null;
		}

		case TreatingKind.FriendRow: {
			const link = elem<HTMLAnchorElement>(
				".friends_field_title",
				element,
			);

			return link?.textContent ?? null;
		}

		case TreatingKind.Bookmark: {
			const link = elem<HTMLAnchorElement>(
				".bookmark_page_item__name > a",
				element,
			);

			return link?.textContent ?? null;
		}

		default: return null;
	}
}

/**
 * @param treating Информация об альтернативном элементе
 * @returns Тип объекта внутри альтернативного элемента
 */
export function getType(
	treating: ITreating,
): SupportedModule | null {
	return treating.subType ?? null;
}

type OptionalHook = NotificationsTogglerHook | null;

const TOGGLER_HOOKS = new WeakMap<Element, OptionalHook>();

/**
 * @param treating Информация об альтернативном элементе
 * @returns Переключатель уведомлений для альтернативного элемента
 */
export function getNotificationsToggler(treating: ITreating): OptionalHook {
	const { element, kind } = treating;

	let hook = TOGGLER_HOOKS.get(element);

	if (hook !== undefined) return hook;

	switch (kind) {
		case TreatingKind.GroupRow: {
			const children = childrenOf<HTMLElement>(
				elem(".ui_actions_menu", element),
			);

			if (children == null) break;

			const menuItem = findWithCallback(
				children,
				"onclick",
				"GroupsList.toggleSubscription",
			);

			if (menuItem != null) {
				hook = createTogglerHook(
					menuItem,
					() => menuItem.dataset.value === "1",
					() => menuItem.click(),
				);
			}
		} break;

		default: break;
	}

	hook = hook ?? null;

	TOGGLER_HOOKS.set(element, hook);

	return hook;
}
