import { ERROR_MESSAGES } from "@utils/debug";
import { getWindow } from "@utils/window";

// #region API самого ВКонтакте

// Храним eval как переменную, чтобы не исполнять его прямо
// в нашем замыкании и исключения подобчных эффектов, кроме
// того ESLint не жалуется на него в таком случае
const { eval: EVAL } = getWindow();

/**
 * Создаёт опции для запроса
 *
 * @param resolve Обработчик исполнения запроса
 * @param reject Обработчик ошибки при запросе
 * @returns Опции для запроса
 */
function genericOptions(resolve: () => void, reject: () => void) {
	return {
		onDone(_html: string, js: string) {
			// ВКонтакте пришлёт JavaScript код для вызова expand-а
			// опций в текущем контексте (window.cur), его нужно
			// выполнить, иначе списки никак не получить
			EVAL(js);

			// _html обычно содержит код, который нужно добавить,
			// но мы можем его смело игнорировать, он нам не нужен

			resolve();
		},
		onFail() {
			reject();
		},
		cache: false,
	};
}

/**
 * Инициализирует списки в текущем контексте
 *
 * @param contextId ID паблика, группы или пользователя
 */
async function initializeLists(contextId: number) {
	return new Promise((resolve, reject) => {
		getWindow().ajax.post("al_feed.php", {
			act: "a_get_lists_by_item",
			// eslint-disable-next-line @typescript-eslint/camelcase
			item_id: contextId,
		}, genericOptions(
			resolve,
			reject,
		));
	});
}

/**
 * Отправляет запрос на переключение списков
 *
 * @param contextId ID паблика, группы или пользователя
 * @param toggles Переключатели (ID списка умн. на -1 если откл., 1 если вкл.)
 * @param hash Уникальный хэш для выполнения запроса
 */
async function toggleLists(contextId: number, toggles: number[], hash: string) {
	return new Promise((resolve, reject) => {
		getWindow().ajax.post("al_feed.php", {
			act: "a_toggle_lists",
			// eslint-disable-next-line @typescript-eslint/camelcase
			item_id: contextId,
			// eslint-disable-next-line @typescript-eslint/camelcase
			lists_ids: toggles.join(","),
			hash,
		}, genericOptions(resolve, reject));
	});
}

// #endregion

/**
 * Статусы списков
 */
type ListsStates = Map<string, ListToggle>;

/**
 * Статус списка (для изменений)
 */
export const enum ListToggle {
	/**
	 * Использовать список для текущего объекта
	 */
	Used = 1,
	/**
	 * Не использовать список для текущего объекта
	 */
	Unused = -1,
}

/**
 * Сохраняет состояние списков для паблика, группы или пользователя
 *
 * @param contextId ID паблика, группы или пользователя
 * @param states Состояние списков
 * @param hash Уникальный хэш для запроса
 */
export async function saveLists(
	contextId: number,
	states: ListsStates,
	hash: string,
) {
	const toggles: number[] = [];
	const postCommit: ([string, ListToggle])[] = [];

	for (const [listId, state] of states.entries()) {
		toggles.push(Number(listId) * state);

		postCommit.push([listId, state]);
	}

	await toggleLists(contextId, toggles, hash);

	const ctx = getWindow().cur;

	if (ctx == null) return;

	const set = (ctx as IListedContext).options?.feedListsSet;

	if (set == null) return;

	for (const [listId, state] of postCommit) {
		set[Number(listId)] = state === ListToggle.Used ? 1 : 0;
	}
}

/**
 * Статус списка
 */
const enum ListStatus {
	/**
	 * Текущий объект не находится в списке
	 */
	Disabled = 0,
	/**
	 * Текущий объект находится в списке
	 */
	Enabled = 1,
}

/**
 * Представляет собой опции страницы после загрузки списков
 */
interface IListedOptions {
	/**
	 * Набор списков и их статусов
	 */
	feedListsSet: {
		[listId: string]: ListStatus;
	};
	/**
	 * Набор списков и их названия
	 */
	feedLists: {
		[listId: string]: string;
	};
	/**
	 * Массив изменений в списках
	 */
	feedListsChanges: number[];
	/**
	 * Хэш для сохранения изменений
	 */
	feedListsHash: string;
}

/**
 * Представляет собой контекст страницы с опциями списков
 */
interface IListedContext {
	/**
	 * Опции страницы
	 */
	options?: Partial<IListedOptions>;
}

/**
 * Представляет собой список
 */
export interface IList {
	/**
	 * ID списка
	 */
	id: number;

	/**
	 * Название списка
	 */
	name: string;

	/**
	 * Проверяет, используется ли список
	 *
	 * @returns Используется ли список
	 */
	isSelected(): boolean;

	/**
	 * Добавляет или убирает текущий объект из списка
	 *
	 * @param value Находится ли объект в списке
	 */
	toggle(value: boolean): void;
}


/**
 * Преобразует списки из опций в объекты списков
 *
 * @param options Опции в текущем контексте
 * @param states Статусы списков
 * @returns Преобразованные списки
 */
function mapLists(options: IListedOptions, states: ListsStates): IList[] {
	const { feedLists, feedListsSet } = options;

	const lists: IList[] = [];

	for (const id of Object.keys(feedListsSet)) {
		const name = feedLists[id];

		lists.push({
			name,
			id: +id,
			isSelected() {
				const state = states.get(id);

				return state == null
					? feedListsSet[id] === ListStatus.Enabled
					: state === ListToggle.Used;
			},
			toggle(isUsed) {
				const state = isUsed
					? ListToggle.Used
					: ListToggle.Unused;

				states.set(id, state);
			},
		});
	}

	return lists;
}

/**
 * Проверяет наличие всех необходимых опций
 *
 * @param options Опции в текущем контексте
 * @returns `true`, если все опции на месте, иначе `false`
 */
export function ensureOptions(
	options?: Partial<IListedOptions>,
): options is IListedOptions {
	return (
		options != null
		&& options.feedLists != null
		&& options.feedListsSet != null
		&& options.feedListsHash != null
		&& options.feedListsChanges != null
	);
}

/**
 * Представляет собой объект списков
 */
export interface ILists {
	/**
	 * Все списки
	 */
	lists: IList[];

	/**
	 * Сбрасывает все изменения к актуальному состоянию
	 */
	resetChanges(): void;

	/**
	 * Сохраняет изменения в списках
	 */
	commitChanges(): Promise<void>;
}

const LISTS_ID_MAPS = new WeakMap<Partial<IListedOptions>, number>();

const CACHES = new WeakMap<Partial<IListedContext>, Map<number, ILists>>();

/**
 * @returns Контекст текущего модуля на странице
 */
function getCurrentContext() {
	return getWindow().cur as IListedContext | undefined;
}

/**
 * Пытается получить прошлый объект списков чтобы избежать повторного запроса
 * к серверам ВКонтакте. Основывается на текущем контексте в окне.
 *
 * @param contextId ID паблика, группы или пользователя
 * @returns `null`, если кэш отсутствует, иначе объект списка
 */
function pullFromCache(contextId: number) {
	const currentContext = getCurrentContext();

	if (currentContext == null) return null;

	return CACHES.get(currentContext)?.get(contextId) ?? null;
}

/**
 * Сохраняет объект списка в кэше до смены контекста модуля на странице
 *
 * @param contextId ID паблика, группы или пользователя
 * @param lists Элемент списков
 */
function pushToCache(contextId: number, lists: ILists) {
	const currentContext = getCurrentContext();

	if (currentContext == null) return;

	let caches = CACHES.get(currentContext);

	if (caches == null) {
		caches = new Map();

		CACHES.set(currentContext, caches);
	}

	caches.set(contextId, lists);
}

/**
 * Инициализирует списки для объекта по ID
 *
 * @param contextId ID паблика, группы или пользователя
 * @param force Следует ли принудительно перезагрузить списки
 * @param useCache Следует ли использовать кэш
 * @throws Если отсутствует контекст
 * @returns Объект со всеми списками и функцией сохранения изменений
 */
export async function getLists(
	contextId: number,
	force = false,
	useCache = true,
): Promise<ILists> {
	const ctx = getWindow().cur as IListedContext | undefined;

	if (ctx == null) {
		throw new Error(ERROR_MESSAGES.NO_OR_INVALID_CONTEXT);
	}

	let { options } = ctx;

	const associatedId = options != null
		? LISTS_ID_MAPS.get(options)
		: null;

	if (associatedId != null && contextId !== associatedId) force = true;

	if (useCache) {
		const cachedLists = pullFromCache(contextId);

		if (cachedLists != null) return cachedLists;
	}

	if (force || !ensureOptions(options)) await initializeLists(contextId);

	if (options == null) options = ctx.options;

	if (options == null || !ensureOptions(options)) {
		throw new Error(ERROR_MESSAGES.NO_OR_INVALID_CONTEXT);
	}

	const states: ListsStates = new Map();

	const lists: ILists = {
		lists: mapLists(options, states),
		resetChanges() {
			states.clear();
		},
		async commitChanges() {
			await saveLists(contextId, states, options!.feedListsHash!);

			states.clear();
		},
	};

	pushToCache(contextId, lists);

	return lists;
}
