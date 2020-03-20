import { elem, insertBefore } from "@utils/dom";
import { getRoaming } from "@components/roaming/ProfileMenuItem";
import { setupInitInterceptors } from "@utils/interceptors";

const PAGE_EXTRA_ACTIONS = ".page_extra_actions_wrap";
const ACTIONS_MENU_INNER = ".page_actions_inner";
const CONTAINER = `${PAGE_EXTRA_ACTIONS} > ${ACTIONS_MENU_INNER}`;

const MOUNT_MENU_ITEM = getRoaming();

/**
 * Встраивает элемент меню, открывающий бокс
 */
function mountMenuItem() {
	const container = elem(CONTAINER);

	const firstItem = container?.firstElementChild;

	if (firstItem == null) return;

	MOUNT_MENU_ITEM((menuItem) => {
		insertBefore(firstItem, menuItem);
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
