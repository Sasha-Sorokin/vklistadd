import { AnyObj, UnknownObj } from "@common/types";
import { ILists } from "@vk/api/lists";
import { ITreating } from "@vk/scrapers";
import { LabelColor } from "./controlsLabel";

export type SaveCallback = (isSaving: boolean) => void;

/**
 * Представляет собой объект интеграции с родительским боксом
 */
export interface IBoxDetail {
	/**
	 * Текущий объект контекста (`window.cur`)
	 */
	context: AnyObj;

	/**
	 * Если бокс вызван не для самой страницы, а элемента на ней
	 * (например, при клике на закладке) — информация об элементе
	 */
	invoker?: ITreating;

	/**
	 * Все компоненты бокса следует отключить
	 */
	disabled?: boolean;

	/**
	 * Обработчик успешной загрузки списков
	 *
	 * @param lists Контроллер списков
	 */
	onListsLoad(this: void, lists: ILists): void;

	/**
	 * Обработчик ошибки загрузки списков
	 */
	onListsLoadFail?(this: void): void;

	/**
	 * Функция отображения надписи снизу бокса
	 */
	displayLabel(this: void, text: string, color?: LabelColor): void;

	/**
	 * Регистрирует обработчик сохранения изменений
	 *
	 * @return Функция для удаления обработчика
	 */
	handleSave(this: void, callback: SaveCallback): () => void;
}
