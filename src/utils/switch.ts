/**
 * Представляет собой переключатель
 */
interface ISwitch {
  /**
   * Текущее состояние переключателя
   */
  readonly currentValue: boolean;
  /**
   * Изменяет текущее состояние переключателя
   *
   * @param newValue Новое состояние переключателя. Если не указано,
   * то инвертирует текущее состояние (`true` => `false`)
   * @return Новое состояние переключателя
   */
  toggle(newValue?: boolean): boolean;
  /**
   * "Лениво" изменяет текущее состояние переключателя:
   * изменяет текущее состояние, но возвращает прошлое
   *
   * @param newValue Новое состояние для переключателя
   * @example
   * ```ts
   * const isFirst = createSwitch(true);
   * if (isFirst.lazyToggle(false)) {
   * // исполняется только один раз!
   * }
   * ```
   * @return Прошлое состояние переключателя
   */
  lazyToggle(newValue?: boolean): boolean;

  /**
   * Добавляет обработчик изменения состояния переключателя
   *
   * @param callback Обработчик изменения состояние
   */
  onChange(callback: SwitchCallback): () => void;
}

/**
 * Представляет собой обработчик изменения состояния переключателя
 *
 * @param newValue Новое состояние переключателя
 */
export type SwitchCallback = (newValue: boolean) => void;

const switchCallbacks = new WeakMap<ISwitch, Set<SwitchCallback>>();

/**
 * @param $switch Переключатель, чьи обработчики нужно вернуть
 * @return Обработчики изменения состояния переключателя `$switch`
 */
function getCallbacks($switch: ISwitch) {
  let callbacks = switchCallbacks.get($switch);

  if (callbacks == null) {
    callbacks = new Set();

    switchCallbacks.set($switch, callbacks);
  }

  return callbacks;
}

/**
 * Безопасно вызывает обработчики переключателя
 *
 * @param $switch Переключатель, состояние которого изменилось
 * @param value Новое состояние переключателя
 */
function invokeCallbacks($switch: ISwitch, value: boolean) {
  for (const callback of getCallbacks($switch)) {
    try {
      callback(value);
    } catch {
      //
    }
  }
}

/**
 * Создаёт переключатель
 *
 * @param initialValue Начальное состояние переключателя
 * @return Простой переключатель
 */
export function createSwitch(initialValue = false): ISwitch {
  let currentValue = initialValue;

  const $switch = {
    get currentValue() {
      return currentValue;
    },
    toggle(newValue?: boolean) {
      currentValue = newValue ?? !currentValue;

      invokeCallbacks($switch, currentValue);

      return currentValue;
    },
    lazyToggle(newValue?: boolean) {
      const $currentValue = currentValue;

      currentValue = newValue ?? !$currentValue;

      invokeCallbacks($switch, currentValue);

      return $currentValue;
    },
    onChange(callback: SwitchCallback) {
      getCallbacks($switch).add(callback);

      return () => getCallbacks($switch).delete(callback);
    },
  };

  return $switch;
}

/**
 * Изменяет текущее состояние переключателя
 *
 * @param $switch Переключатель, состояние которого нужно изменить
 * @param newValue Новое состояние переключателя, если не указано,
 * то инвертирует текущее состояние (`true` => `false`)
 * @return Новое состояние переключателя
 */
export function toggle($switch: ISwitch, newValue?: boolean): boolean {
  return $switch.toggle(newValue);
}

/**
 * "Лениво" изменяет текущее состояние переключателя:
 * изменяет текущее состояние, но возвращает прошлое
 *
 * @param $switch Переключатель, состояние которого нужно изменить
 * @param newValue Новое состояние для переключателя
 * @example
 * ```ts
 * const isFirst = createSwitch(true);
 * if (lazyToggle(isFirst, false)) {
 * // исполняется только один раз!
 * }
 * ```
 * @return Прошлое состояние переключателя
 */
export function lazyToggle($switch: ISwitch, newValue?: boolean): boolean {
  return $switch.lazyToggle(newValue);
}

/**
 * Добавляет обработчик изменения состояния переключателя
 *
 * @param $switch Переключатель, чьё состояние наблюдается
 * @param callback Обработчик изменения состояния
 * @return Функция, убирающая обработчик
 */
export function watchSwitch($switch: ISwitch, callback: SwitchCallback) {
  return $switch.onChange(callback);
}

/**
 * @param $switch Переключатель, чьё состояние необходимо вернуть
 * @return Текущее состояние переключателя
 */
export function valueOf($switch: ISwitch) {
  return $switch.currentValue;
}
