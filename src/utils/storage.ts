// В некоторых скриптовых менеджерах функции сохранения и получения
// настроек асинхронны, в других наоборот. Для непромисов await тоже
// можно по-прежнему вызывать, хоть это и плохая практика

/**
 * Возвращает функцию сохранения настроек текущего скриптового менеджера
 *
 * @returns Функция сохранения настроек в текущем скриптовом менеджере
 */
function getGetValue() {
	// eslint-disable-next-line
	return GM?.getValue ?? GM_getValue;
}

/**
 * Получает и возвращает сохранённую настройку в текущем скриптовом менеджере,
 * если настройка не сохранялась до этого, возвращает значение по умолчанию
 *
 * @param name Название настройки, которую необходимо запросить
 * @param defaultValue Значение настройки по умолчанию
 * @returns Прошлое сохранённое значение или значение по умолчанию
 */
export async function getValueOrDefault<TValue extends GM.Value>(
	name: string,
	defaultValue: TValue,
): Promise<TValue> {
	const value = await getGetValue()(name);

	if (value == null) return defaultValue;

	return value as TValue;
}

/**
 * Получает значение сохранённой настройки
 *
 * @param name Название настройки, которую необходимо запросить
 * @returns Прошлое сохранённое значение для указанной настройки или `undefined`
 */
export async function getValue<TValue extends GM.Value>(
	name: string,
): Promise<TValue | undefined> {
	const value = await getGetValue()(name);

	return value as TValue;
}

/**
 * Сохраняет значение настройки в текущем скриптовом менеджере
 *
 * Непримитивные значения сохраняются в каждом менеджере по-разному,
 * поэтому рекомендуется упрощать данные, для объектов использовать JSON
 *
 * @param name Название изменяемой настройки
 * @param value Значение указанной настройки
 */
export async function setValue(name: string, value: GM.Value) {
	// eslint-disable-next-line
	const setGMValue = GM?.setValue ?? window.GM_setValue;

	await setGMValue(name, value);
}
