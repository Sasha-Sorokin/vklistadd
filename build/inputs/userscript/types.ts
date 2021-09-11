import type { PackageJson } from "types-package-json";
import type {
  GeneratorOptionsInput,
  UserScriptMeta,
} from "userscript-header-generator";
import type { IConfig, IIntermediateData } from "../../types";
import type { ValueOrPromise } from "../../utils/promise-value";

export type ExcludeNullables<T> = T extends null | undefined ? never : T;

/**
 * Представляет собой конфигурацию UserScript-а.
 */
export interface IUserScriptConfig {
  /**
   * Метод, возвращающий мета-данные пользовательского скрипта.
   *
   * @param buildConfig Конфигурация сборки.
   * @param pkg Конфигурация NPM пакета.
   * @return Мета-данные пользовательского скрипта.
   */
  meta(buildConfig: IConfig, pkg: PackageJson): UserScriptMeta;

  /**
   * Метод, возвращающий опции генератора шапки пользовательского скрипта.
   *
   * @param buildConfig Конфигурация сборки.
   * @param data Данные сборки.
   * @return Опции генератора шапки пользовательского скрипта.
   */
  generatorOptions(
    buildConfig: IConfig,
    data: IIntermediateData,
  ): ValueOrPromise<ExcludeNullables<GeneratorOptionsInput>>;
}
