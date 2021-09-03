import { ERROR_MESSAGES, log } from "@utils/debug";
import { createSwitch, lazyToggle } from "@utils/switch";
import * as actionMenuButton from "@components/roaming/ActionButton";
import { elem } from "@utils/dom";
import { setupInitInterceptors } from "@utils/interceptors";

const MOUNT_ACTION_BUTTON = actionMenuButton.getRoaming();

const ACTIONS_CONTAINER = "._page_actions_container";
const MSG_STATUS_BLOCK = ".group_send_msg_status_block";

/**
 * Встраивает кнопку вызова окна изменения списков
 */
function injectActionButton() {
	const container = elem(ACTIONS_CONTAINER);

	if (container == null) {
		log("error", "Failed to find page actions container!");

		return;
	}

	let referenceNode: Element | null;

	{
		const sendMsgAction = elem(MSG_STATUS_BLOCK, container);

		if (sendMsgAction != null) referenceNode = sendMsgAction;
		else referenceNode = container.firstElementChild;
	}

	if (referenceNode == null) {
		log("warn", "Failed to find reference node!");

		return;
	}

	MOUNT_ACTION_BUTTON((actionButton) => {
		const mountNode = referenceNode?.parentNode;

		const button = mountNode?.insertBefore(actionButton, referenceNode);

		log("info", "Successfully injected button:", button);
	}, undefined);
}

const IS_INJECTED = createSwitch(false);

/**
 * Встраивает в объект окна отловщиков инициализаций всех объектов,
 * похожих на группы: то есть группы и публичные страницы. После отлова
 * встраивает на странице кнопку вызова окна изменения списков.
 *
 * @throws При попыткой повторного встраивания (скорее всего, ошибка)
 */
export function prepare() {
	if (lazyToggle(IS_INJECTED, true)) {
		throw new Error(ERROR_MESSAGES.alreadyInjected);
	}

	setupInitInterceptors([
		["public", injectActionButton],
		["Groups", injectActionButton],
	]);
}
