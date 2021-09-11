import { pointerLocked } from "@common/css";
import { hasFlag } from "./bitwise";
import { getWindow } from "./window";

type Button = HTMLButtonElement;

/**
 * Перечисление состояний кнопки
 */
export const enum ButtonState {
  /**
   * Кнопка в своём привычном состоянии, живёт себе припеваючи
   */
  Interactive = 2,

  /**
   * Кнопка отключена
   */
  Disabled = 4,

  /**
   * Кнопка заблокирована и на ней отображается прогресс
   */
  Progress = 6,
}

/**
 * Перечисление классов кнопки
 */
enum ButtonClass {
  /**
   * Кнопка заблокирована
   */
  Locked = "flat_btn_lock",

  /**
   * Кнопка отключена
   */
  Disabled = "button_disabled",
}

const buttonDisableClasses = [pointerLocked, ButtonClass.Disabled];

/**
 * Переключает "выключеное" состояние кнопки
 *
 * @param button Кнопка, которую нужно включить/выключить
 * @param isDisabled Выключена ли кнопка
 */
function toggleButtonDisable(button: Button, isDisabled: boolean) {
  for (const className of buttonDisableClasses) {
    button.classList.toggle(className, isDisabled);
  }
}

/**
 * Переключает "заблокированное" состояние кнопки
 *
 * @param button Кнопка, которую нужно разблокировать/заблокировать
 * @param isLocked Заблокирована ли кнопка
 */
function toggleButtonLock(button: Button, isLocked: boolean) {
  const window = getWindow();

  if (isLocked) window.lockButton(button);
  else window.unlockButton(button);
}

/**
 * Устанавливает состояние кнопки
 *
 * @param button Кнопка, состояние которой необходимо изменить
 * @param state Новое состояние кнопки
 */
export function setButtonState(button: Button, state: ButtonState) {
  toggleButtonDisable(button, hasFlag(state, ButtonState.Disabled));
  toggleButtonLock(button, hasFlag(state, ButtonState.Progress));
}
