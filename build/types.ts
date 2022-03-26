import type { PackageJson } from "types-package-json";
import type { CommonPluginsSet } from "./plugins/types";

/**
 * Представляет собой конфигурацию сборки.
 */
export interface IConfig {
  /**
   * Корневая папка всего проекта.
   *
   * Представлена в POSIX-формате.
   */
  rootDir: string;

  /**
   * Папка с исходным кода проекта.
   *
   * Представлена в POSIX-формате.
   */
  srcDir: string;

  /**
   * Папка для размещения скомпилированного кода.
   *
   * Представлена в POSIX-формате.
   */
  distDir: string;

  /**
   * Адрес GitHub сервера.
   *
   * @example "https://github.com"
   */
  githubServer: string;

  /**
   * Репозиторий, для которого выполняется сборка.
   */
  githubRepo: string;

  /**
   * Ветвь или тег для которого запущена сборка
   *
   * @default "HEAD"
   */
  ref: string;

  /**
   * Перечисление всех задач сборок для Rollup.
   */
  inputs: string;

  /**
   * Производится ли сборка для продакшена.
   */
  isProduction: boolean;
}

/**
 * Представляет собой первоначальные данные для сборки.
 */
export interface IInitialData {
  /**
   * Распарсеный package.json из корневой папки проекта.
   */
  rootPackageJson: PackageJson;

  /**
   * Значения переменных в путях.
   */
  pathVariables: Record<string, string>;
}

/**
 * Представляет собой данные для сборки.
 */
export interface IIntermediateData extends IInitialData {
  /**
   * Набор плагинов для общего использования.
   */
  commonPluginsSet: CommonPluginsSet;
}
