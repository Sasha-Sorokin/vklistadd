import type { RollupOptions } from "rollup";
import type { IConfig, IIntermediateData } from "../types";
import type { ValueOrPromise } from "../utils/promise-value";

/**
 * Представляет собой единичную точку сборки.
 */
export interface IInput {
  /**
   * Возвращает опции для включения в сборку Rollup.
   *
   * @param config Конфигурация сборки.
   * @param data Данные сборки.
   * @return Опции для включения в сборку Rollup.
   */
  optionDefinitions(
    config: IConfig,
    data: IIntermediateData,
  ): ValueOrPromise<RollupOptions | RollupOptions[]>;
}
