type ReadyCallback = () => void;

const SCHEDULED_CALLBACKS: Set<ReadyCallback> = new Set();

let isHandled = true;

/**
 * Проверяет наличие обработчика и добавляет его, если тот отсутствует
 */
function ensureHandler() {
	if (isHandled) return;

	document.addEventListener("load", () => {
		for (const callback of SCHEDULED_CALLBACKS) {
			callback();

			return;
		}

		SCHEDULED_CALLBACKS.clear();
	});

	isHandled = true;
}

/**
 * Выполняет переданную функцию только если документ загружен, иначе добавляет
 * обработчик для позднего запуска, когда страница загрузится
 * @param callback Функция, которую нужно выполнить
 */
export function ready(callback: ReadyCallback) {
	if (document.readyState === "complete") {
		callback();
	}

	SCHEDULED_CALLBACKS.add(callback);

	ensureHandler();
}
