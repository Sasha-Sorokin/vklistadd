import { ILists } from "@vk/api/lists";
import { useReducer } from "preact/hooks";
import { ITreating, PartialContext } from "@vk/scrapers";
import { LoadingState, ListsActions } from "./types";
import { LISTS_LOADED, LOAD_FAILED, INVOKER_CHANGE } from "./actions";

/**
 * Представляет собой состояние компонента списков
 */
interface IListsState {
	/**
	 * Текущий статус загрузки списков
	 */
	loadingStatus: LoadingState;

	/**
	 * Объект списков
	 */
	lists?: ILists;

	/**
	 * Последний объект, для которого загружались списки
	 */
	lastTarget?: PartialContext;

	/**
	 * Последний использованный альтернативный элемент при загрузке списков
	 */
	lastInvoker?: ITreating;
}

/**
 * Редьюсер загрузчика списков
 *
 * @param state Текущее состояние
 * @param action Предпринимаемое действие
 * @returns Состояние после выполнения действия
 */
export function listsReducer(
	state: Readonly<IListsState>,
	action: ListsActions,
): Readonly<IListsState> {
	switch (action.type) {
		case LISTS_LOADED: {
			return {
				...state,
				loadingStatus: LoadingState.Loaded,
				lists: action.lists ?? undefined,
			};
		}

		case LOAD_FAILED: {
			return {
				...state,
				loadingStatus: LoadingState.Failed,
			};
		}

		case INVOKER_CHANGE: {
			const { invoker, target } = action;
			const { lastInvoker, lastTarget } = state;

			const noChanges = invoker === lastInvoker
				&& target === lastTarget;

			if (noChanges) return state;

			return {
				...state,
				loadingStatus: LoadingState.Reset,
				lastInvoker: invoker,
				lastTarget: target,
				lists: undefined,
			};
		}

		default: return { ...state };
	}
}

const DEFAULT_STATE = Object.freeze({
	loadingStatus: LoadingState.Initial,
});

/**
 * Хук для использования редьюсера загрузчика списков
 *
 * @returns Состояние редьюсера и функция выполнения действия
 */
export function useLoaderReducer() {
	return useReducer(listsReducer, DEFAULT_STATE);
}
