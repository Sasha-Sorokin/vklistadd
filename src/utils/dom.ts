import { getWindow } from "./window";
import { ERROR_MESSAGES, log } from "./debug";

/**
 * Возвращает элемент, который соответствует селекторам
 *
 * @param selectors Селектор или селекторы, по которым ищется элемент
 * @param scope Элемент в котором производится поиск элемента
 * @return Найденный элемент
 */
export function elem<E extends Element = Element>(
	selectors: string,
	scope?: Element,
): E | null {
	return (scope ?? getWindow().document).querySelector(selectors);
}

/**
 * Возвращает все элементы, которые соответствуют селекторам
 *
 * @param selectors Селектор или селекторы, по которым отбираются элементы
 * @param scope Элемент в котором производится поиск элемента
 * @return Отобранные элементы
 */
export function elems<E extends Element = Element>(
	selectors: string,
	scope?: Element,
): NodeListOf<E> {
	return (scope ?? getWindow().document).querySelectorAll(selectors);
}

/**
 * Встраивает элемент `newNode` перед `referenceNode`, в его
 * родительском элементе
 *
 * @param referenceNode Элемент, перед которым встраивается `newNode`
 * @param newNode Элемент, который встраивается перед `referenceNode`
 */
export function insertBefore(referenceNode: Node, newNode: Node) {
	const { parentNode } = referenceNode;

	if (parentNode == null) throw new Error(ERROR_MESSAGES.noParentNode);

	parentNode.insertBefore(newNode, referenceNode);
}

/**
 * Преобразует список DOM узлов в массив
 *
 * @param nodeList Список, который нужно преобразовать
 * @return Массив узлов из переданного списка
 */
export function asArray<E extends Element = Element>(
	nodeList: NodeListOf<E> | HTMLCollectionOf<E>,
) {
	return Array.prototype.slice.call(nodeList) as E[];
}

/**
 * @param value Значение, для которого нужно убрать кавычки
 * @return `value` без кавычек
 */
export function unwrapCSSValue(value: string) {
	return /^"(.+)"$|^'(.+)'$/.exec(value)?.[1] ?? value;
}

const DOM_PARSER = new DOMParser();

/**
 * @param input DOM строка, которую требуется разобрать
 * @return Unicode вариант строки `input`
 * @example
 * ```js
 * decodeDOMString('&copy; Great Inc., 2020');
 * // => '© Great Inc., 2020'
 * ```
 */
export function decodeDOMString(input: string) {
	const { documentElement } = DOM_PARSER.parseFromString(input, "text/html");

	return documentElement.textContent;
}

/**
 * @param element Элемент, дочерние элементы которого необходимо вернуть
 * @return Массив дочерних элементов `element` или null
 */
export function childrenOf<E extends Element>(element?: Element | null) {
	return element == null
		? null
		: asArray<E>(element.childNodes as NodeListOf<E>);
}

export type ParentMatchFunction = (e: HTMLElement) => boolean;

/**
 * Взбирается по дереву элементов начиная с `element` и возвращает первый
 * родительский элемент, который удовлетворяет `search`
 *
 * @param element Дочерний элемент, с которого начинается поиск
 * @param match Поиск: CSS селектор или функция, которой передаётся элемент
 * @return Первый родительский элемент, удовлетворяющий `search`, либо `null`
 */
export function findMatchingParent<E extends HTMLElement>(
	element: HTMLElement,
	match: string | ParentMatchFunction,
): E | null {
	let currentParent: HTMLElement | null = element;

	// eslint-disable-next-line no-return-assign
	const nextParent = () => {
		currentParent = currentParent?.parentElement ?? null;

		return currentParent;
	};

	const isMatchFunction = typeof match === "function";

	while (nextParent() != null) {
		if (isMatchFunction) {
			if (match(currentParent)) {
				return currentParent as E;
			}

			continue;
		}

		if (currentParent.matches(match)) {
			return currentParent as E;
		}
	}

	return null;
}

type Callback = (mutations: MutationRecord[]) => void;

/**
 * Представляет собой наблюдение за элементом
 */
interface IObservation {
	/**
	 * Добавляет обработчик события изменений
	 */
	addCallback(callback: Callback): void;

	/**
	 * Убирает обработчик события изменений
	 */
	removeCallback(callback: Callback): void;
}

const OBSERVATIONS = new WeakMap<HTMLElement, Readonly<IObservation>>();

// eslint-disable-next-line @typescript-eslint/no-extra-parens
export const OBSERVE_OPTIONS_ATTRIBUTES: Readonly<MutationObserverInit> =
	Object.freeze({
		subtree: false,
		childList: false,
		attributes: true,
	});

/**
 * Время в миллисекундах до того, как наблюдатель будет устранён
 */
const BEFORE_OBSERVER_DESTROY = 1000; // мс

const CURRENT_DESTROY_TIMERS = new WeakMap<MutationObserver, number>();

/**
 * Создаёт наблюдатель за изменениями указанного DOM элемента с возможностью
 * добавлять несколько обработчиков
 *
 * Альтернатива обычному MutitationObserver, который делает всё наоборот:
 * позволяет иметь один обработчик, но наблюдать несколько элементов.
 *
 * @param element Элемент, за которым требуется вести наблюдение
 * @param options Опции для наблюдателя
 * @return Объект с методами для добавления обработчиков
 */
export function observe(
	element: HTMLElement,
	options = OBSERVE_OPTIONS_ATTRIBUTES,
) {
	let observation = OBSERVATIONS.get(element);

	if (observation == null) {
		const callbacks = new Set<Callback>();

		const observer = new MutationObserver((mutations) => {
			log("log", element, "mutated, calling callbacks", callbacks);

			for (const callback of callbacks) {
				try {
					callback(mutations);
				} catch (err) {
					log("warn", "Observer callback failure:", err);
				}
			}
		});

		const destroy = () => {
			observer.disconnect();

			OBSERVATIONS.delete(element);

			log("info", "Observer destroyed", { element });
		};

		const clearDestroy = () => {
			const destroyTimer = CURRENT_DESTROY_TIMERS.get(observer);

			if (destroyTimer == null) return;

			clearTimeout(destroyTimer);
		};

		const scheduleDestroy = () => {
			const destroyTimer = setTimeout(destroy, BEFORE_OBSERVER_DESTROY);

			CURRENT_DESTROY_TIMERS.set(observer, destroyTimer);
		};

		observation = Object.freeze({
			addCallback: (callback) => {
				callbacks.add(callback);

				clearDestroy();
			},

			removeCallback: (callback) => {
				callbacks.delete(callback);

				if (callbacks.size !== 0) return;

				scheduleDestroy();
			},
		} as IObservation);

		observer.observe(element, options);

		OBSERVATIONS.set(element, observation);
	}

	return observation;
}
