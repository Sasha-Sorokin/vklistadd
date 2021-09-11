import { errorMessages } from "@utils/errors";
import { createSwitch, lazyToggle } from "@utils/switch";
import * as actionMenuButton from "@components/roaming/ActionButton";
import { elem } from "@utils/dom";
import { setupInitInterceptors } from "@utils/interceptors";
import { log } from "@utils/debug";

const mountFunction = actionMenuButton.getRoaming();

const actionsContainerSelector = "._page_actions_container";
const messagesStatesBlockSelector = ".group_send_msg_status_block";

/**
 * Встраивает кнопку вызова окна изменения списков
 */
function mountActionButton() {
  const container = elem(actionsContainerSelector);

  if (container == null) {
    log("error", "Failed to find page actions container!");

    return;
  }

  let referenceNode: Element | null;

  {
    const sendMsgAction = elem(messagesStatesBlockSelector, container);

    if (sendMsgAction != null) referenceNode = sendMsgAction;
    else referenceNode = container.firstElementChild;
  }

  if (referenceNode == null) {
    log("warn", "Failed to find reference node!");

    return;
  }

  mountFunction((actionButton) => {
    const mountNode = referenceNode?.parentNode;

    const button = mountNode?.insertBefore(actionButton, referenceNode);

    log("info", "Successfully injected button:", button);
  }, undefined);
}

const isInjectedSwitch = createSwitch(false);

/**
 * Встраивает в объект окна отловщиков инициализаций всех объектов,
 * похожих на группы: то есть группы и публичные страницы. После отлова
 * встраивает на странице кнопку вызова окна изменения списков.
 *
 * @throws При попыткой повторного встраивания (скорее всего, ошибка)
 */
export function prepare() {
  if (lazyToggle(isInjectedSwitch, true)) {
    throw new Error(errorMessages.alreadyInjected);
  }

  setupInitInterceptors([
    ["public", mountActionButton],
    ["Groups", mountActionButton],
  ]);
}
