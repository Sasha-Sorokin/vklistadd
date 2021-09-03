import { elem, insertBefore } from "@utils/dom";
import { getRoaming } from "@components/roaming/ProfileMenuItem";
import { setupInitInterceptors } from "@utils/interceptors";

const CONTAINER = ".profile_actions > .page_actions_expanded" as const;

const MOUNT_MENU_ITEM = getRoaming();

/**
 * Встраивает элемент меню, открывающий бокс
 */
function mountMenuItem() {
	const container = elem(CONTAINER);

	if (container == null) return;

	let referenceElement = elem(
		".PageActionCellSeparator",
		container,
	)?.nextElementSibling;

	referenceElement ??= container.firstElementChild?.nextElementSibling;

	if (referenceElement == null) return;

	MOUNT_MENU_ITEM((menuItem) => {
		insertBefore(referenceElement!, menuItem);
	}, undefined);
}

/**
 * Встраивает в объект окна отловщика инициализации страницы пользователя.
 * После отлова встраивает на странице меню элемент, открывающий окно
 * изменения списков
 */
export function prepare() {
	setupInitInterceptors([["Profile", mountMenuItem]]);
}
