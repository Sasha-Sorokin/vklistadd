import { Actions } from "@common/types";
import { listsLoaded, loadFailure, targetChange } from "./actions";

type ActionsUnion =
	| typeof listsLoaded
	| typeof loadFailure
	| typeof targetChange;

export type ListsActions = Actions<ActionsUnion>;

/**
 * Состояние загрузки списков
 */
export const enum LoadingState {
	/**
	 * Начальное состояние, ожидается эффект смены текущего объекта
	 *
	 * Следует сменить текущий объект.
	 */
	Initial = "initial",

	/**
	 * Сменилась цель и требуется загрузить списки
	 *
	 * Следует начать загрузку списков.
	 */
	Reset = "reset",

	/**
	 * Списки загружаются
	 *
	 * Следует отобразить индикатор загрузки.
	 */
	Loading = "loading",

	/**
	 * Объект списков загружен и готов к использованию
	 *
	 * Следует отрисовать объекты списков
	 */
	Loaded = "loaded",

	/**
	 * Загрузка списков провалилась
	 *
	 * Следует отрисовать сообщение об ошибке
	 */
	Failed = "failed",
}
