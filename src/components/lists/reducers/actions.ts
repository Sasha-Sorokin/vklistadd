import { ILists } from "@vk/api/lists";
import { ITreating, PartialContext } from "@vk/scrapers";

export const LISTS_LOADED = "LISTS_LOADED";

/**
 * @param lists Новый объект списков
 * @returns Действие после загрузки списков
 */
export function listsLoaded(lists: ILists | null) {
	return {
		type: LISTS_LOADED,
		lists,
	} as const;
}

export const LOAD_FAILED = "LOAD_FAILED";

/**
 * @returns Действие после ошибки загрузки списков
 */
export function loadFailure() {
	return { type: LOAD_FAILED } as const;
}

export const INVOKER_CHANGE = "INVOKER_CHANGE";

/**
 * @param target Новый объект
 * @param invoker Новый альтернативный элемент
 * @returns Действие по изменению текущего объекта и альтернативного элемента
 */
export function targetChange(target?: PartialContext, invoker?: ITreating) {
	return {
		type: INVOKER_CHANGE,
		invoker,
		target,
	} as const;
}
