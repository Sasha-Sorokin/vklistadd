import type { ILists } from "@vk/api/lists";
import type { ITreating, PartialContext } from "@vk/scrapers";

/**
 * Представляет собой действия внутри редьюсера списка.
 */
export enum ListActionType {
  /**
   * Сообщает о том, что загрузка элементов списка завершена.
   */
  ListsLoaded = "lists_loaded",

  /**
   * Сообщает о том, что загрузка списков провалилась.
   */
  LoadFailed = "load_failed",

  /**
   * Сообщает об изменении вызывающего элемента.
   */
  TargetChange = "target_change",
}

/**
 * @param lists Новый объект списков
 * @return Действие после загрузки списков
 */
export function listsLoaded(lists: ILists | null) {
  return {
    type: ListActionType.ListsLoaded,
    lists,
  } as const;
}

/**
 * @return Действие после ошибки загрузки списков
 */
export function loadFailure() {
  return { type: ListActionType.LoadFailed } as const;
}

/**
 * @param target Новый объект
 * @param invoker Новый альтернативный элемент
 * @return Действие по изменению текущего объекта и альтернативного элемента
 */
export function targetChange(target?: PartialContext, invoker?: ITreating) {
  return {
    type: ListActionType.TargetChange,
    invoker,
    target,
  } as const;
}
