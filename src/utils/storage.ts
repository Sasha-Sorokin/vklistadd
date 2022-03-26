// В некоторых скриптовых менеджерах функции сохранения и получения
// настроек асинхронны, в других наоборот. Для непромисов await тоже
// можно по-прежнему вызывать, хоть это и плохая практика

import { promisify } from "./promisify";

/**
 * Возвращает функцию сохранения настроек текущего скриптового менеджера.
 *
 * @return Функция сохранения настроек в текущем скриптовом менеджере.
 */
function getGetValue() {
  // NOTE(Braw): ESLint отключён, т.к. в тайпингах не указано, что GM может быть
  // не предоставлен в контексте, потому что идеально он должен быть представлен
  // всегда, но кто его знает, какой менеджер будет использовать пользователь.
  // eslint-disable-next-line
  return GM?.getValue ?? promisify(GM_getValue);
}

/**
 * Получает и возвращает сохранённую настройку в текущем скриптовом менеджере,
 * если настройка не сохранялась до этого, возвращает значение по умолчанию.
 *
 * @param name Название настройки, которую необходимо запросить.
 * @param defaultValue Значение настройки по умолчанию.
 * @return Прошлое сохранённое значение или значение по умолчанию.
 */
export async function getValueOrDefault<TValue>(
  name: string,
  defaultValue: TValue,
): Promise<TValue> {
  const value = await getGetValue()(name);

  if (value == null) return defaultValue;

  return value as TValue;
}

/**
 * Получает значение сохранённой настройки.
 *
 * @param name Название настройки, которую необходимо запросить.
 * @return Прошлое сохранённое значение для указанной настройки или `undefined`.
 */
export async function getValue<TValue>(
  name: string,
): Promise<TValue | undefined> {
  const value = await getGetValue()(name);

  return value as TValue;
}

/**
 * Сохраняет значение настройки в текущем скриптовом менеджере.
 *
 * Непримитивные значения сохраняются в каждом менеджере по-разному, поэтому
 * рекомендуется упрощать данные, для объектов использовать JSON.
 *
 * @param name Название изменяемой настройки
 * @param value Значение указанной настройки
 */
export async function setValue<TValue>(name: string, value: TValue) {
  // NOTE(Braw): см строку 13.
  // eslint-disable-next-line
  const setGMValue = GM?.setValue ?? promisify(GM_setValue);

  await setGMValue(name, value);
}
