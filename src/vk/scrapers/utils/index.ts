import type { Member } from "@common/types";
import { getWindow } from "@utils/window";
import { SupportedModule } from "../types";

/**
 * Представляет собой общий контекст для пабликов, групп и пользователей
 */
interface ISharedContext {
  /**
   * ID текущего объекта (паблика/группы/пользователя)
   */
  oid: number;

  /**
   * Тип текущего модуля
   */
  module: string;
}

/**
 * @return Текущий контекст на странице
 */
export function getContext<T = Record<Member, unknown>>() {
  return getWindow().cur as ISharedContext & T;
}

/**
 * @param module Строка `module` из текущего контекста
 * @return Является ли модуль `module` поддерживающимся модулем
 */
export function isSupportedModule(module: string): module is SupportedModule {
  return (
    module === SupportedModule.Group ||
    module === SupportedModule.Public ||
    module === SupportedModule.Public
  );
}
