import type { ILists } from "@vk/api/lists";
import type { ITreating, PartialContext } from "@vk/scrapers";
import { useReducer } from "@external/preact/hooks";
import { LoadingState, ListsActions } from "./types";
import { ListActionType } from "./actions";

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
 * @return Состояние после выполнения действия
 */
export function listsReducer(
  state: Readonly<IListsState>,
  action: ListsActions,
): Readonly<IListsState> {
  switch (action.type) {
    case ListActionType.ListsLoaded: {
      return {
        ...state,
        loadingStatus: LoadingState.Loaded,
        lists: action.lists ?? undefined,
      };
    }

    case ListActionType.LoadFailed: {
      return {
        ...state,
        loadingStatus: LoadingState.Failed,
      };
    }

    case ListActionType.TargetChange: {
      const { invoker, target } = action;
      const { lastInvoker, lastTarget } = state;

      const noChanges = invoker === lastInvoker && target === lastTarget;

      if (noChanges) return state;

      return {
        ...state,
        loadingStatus: LoadingState.Reset,
        lastInvoker: invoker,
        lastTarget: target,
        lists: undefined,
      };
    }

    default:
      return { ...state };
  }
}

const defaultState = Object.freeze({
  loadingStatus: LoadingState.Initial,
});

/**
 * Хук для использования редьюсера загрузчика списков
 *
 * @return Состояние редьюсера и функция выполнения действия
 */
export function useLoaderReducer() {
  return useReducer(listsReducer, defaultState);
}
