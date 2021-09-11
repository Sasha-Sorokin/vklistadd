/* eslint-disable @typescript-eslint/no-explicit-any */

import { createLayeredProxy } from "proxy-layers";

/**
 * Представляет собой информацию о ресурсе
 */
interface IResourceInfo {
  /**
   * ID ресурса
   */
  resourceId: string;
}

/**
 * Представляет собой слой с функциями определения и получения определений.
 */
interface IContextLayer {
  /**
   * Функция получения определений.
   */
  require: Requirer;

  /**
   * Функция определения.
   */
  define: Definer;
}

type Module = any;

export type Definer = (this: void, moduleName: string, module: Module) => void;

export type DefinitionsMap = Map<string, Module>;

export type ResourceMap = Map<string, DefinitionsMap>;

export type Requirer = <T = Module>(
  this: void,
  resourceId: string,
  moduleName: string,
) => T;

type ModuleWrapper = (this: IResourceInfo, $$$context$$$: any) => void;

export class GreaseLoader {
  private readonly _context: any;

  private readonly _resources: ResourceMap = new Map();

  /**
   * Конструирует новый загрузчик ресурсов.
   *
   * @param context Контекст, в котором выполняется каждый модуль.
   */
  constructor(context: any) {
    this._context = context;
  }

  /**
   * @return Все ранее загруженные ресурсы.
   */
  public getResources(): ResourceMap {
    const defensiveCopy = new Map();

    for (const [resourceName, defenitions] of this._resources) {
      defensiveCopy.set(resourceName, new Map(defenitions));
    }

    return defensiveCopy;
  }

  /**
   * Все определения ресурса.
   *
   * @param resourceId Ресурс, определения которого нужно найти.
   * @return Все определения ресурса.
   */
  public getDefinitions(resourceId: string): DefinitionsMap | null {
    const map = this._resources.get(resourceId);

    if (map == null) return null;

    return new Map(map);
  }

  /**
   * Создаёт функцию для определения модулей.
   *
   * @param resourceId Ресурс, для которого создаётся функция определения.
   * @return Функция определения модулей для указанного ресурса.
   */
  public createCustomDefiner(resourceId: string) {
    const definitions = this._getCreateResourceDefinitions(resourceId);

    return GreaseLoader._makeDefiner(resourceId, definitions);
  }

  /**
   * Выполнняет несколько ресурсов привязанных к скрипту поочерёдно.
   *
   * @param resourceIds Идентификаторы ресурсов для загрузки.
   * @return
   * Карту всех загруженных ресурсов и их определений, а также функцию для
   * поиска модуля среди всех загруженных модулей.
   */
  public async loadMultiple(
    resourceIds: string[],
  ): Promise<[loadedResources: ResourceMap, loaderRequirer: Requirer]> {
    const resourceMap: ResourceMap = new Map();

    for (const resourceId of resourceIds) {
      const [definitions] = await this.load(resourceId);

      resourceMap.set(resourceId, definitions);
    }

    return [resourceMap, this._requirer];
  }

  /**
   * Выполняет код из прикреплённого к скрипту ресурса.
   *
   * @param resourceId Идентификатор ресурса внутри GreaseMonkey.
   * @return Все определения и функцию для поиска модуля.
   */
  public async load(
    resourceId: string,
  ): Promise<[moduleDefinitions: DefinitionsMap, loaderRequirer: Requirer]> {
    const content = await GreaseLoader._getContents(resourceId);

    if (content == null) {
      throw new Error(
        `Resource "${resourceId}" has not been loaded by the script manager.`,
      );
    }

    const resourceInfo: IResourceInfo = { resourceId };

    // eslint-disable-next-line no-new-func
    const wrapper: ModuleWrapper = Function(
      "$$$context$$$",
      GreaseLoader._wrapInContext(content, "$$$context$$$"),
    ) as any;

    const definitions = this._getCreateResourceDefinitions(resourceId);
    const definer = GreaseLoader._makeDefiner(resourceId, definitions);
    const layer = GreaseLoader._makeContextLayer(definer, this._requirer);
    const context = createLayeredProxy(this._context, layer);

    wrapper.call(resourceInfo, context);

    return [new Map(definitions), this._requirer];
  }

  private _getCreateResourceDefinitions(resourceId: string) {
    let definitions = this._resources.get(resourceId);

    if (definitions == null) {
      definitions = new Map();

      this._resources.set(resourceId, definitions);
    }

    return definitions;
  }

  private static _makeDefiner(
    resourceId: string,
    definitions: DefinitionsMap,
  ): Definer {
    return function define(definitionKey: string, definition: any) {
      if (definitions.has(definitionKey)) {
        throw new Error(
          `Resource "${resourceId}" has earlier defined the module ` +
            `"${definitionKey}".`,
        );
      }

      definitions.set(definitionKey, definition);
    };
  }

  private static _makeRequirer(resourceMap: ResourceMap): Requirer {
    return function require(resourceId: string, definitionKey: string) {
      const definitions = resourceMap.get(resourceId);

      if (definitions == null) {
        throw new Error(`Resource "${resourceId}" is not loaded yet.`);
      }

      if (!definitions.has(definitionKey)) {
        throw new Error(
          `No "${definitionKey}" has been defined for the` +
            `resource "${resourceId}".`,
        );
      }

      return definitions.get(definitionKey);
    };
  }

  private static async _getContents(
    resourceId: string,
  ): Promise<string | null> {
    return (
      // eslint-disable-next-line
      GM?.getResourceText?.(resourceId) ??
      Promise.resolve(GM_getResourceText(resourceId))
    );
  }

  private static _wrapInContext(code: string, context: string) {
    return `with (${context}) {${code}}`;
  }

  private static _makeContextLayer(definer: Definer, requirer: Requirer) {
    const layer: IContextLayer = Object.create(null);

    layer.define = definer;
    layer.require = requirer;

    return layer;
  }

  private readonly _requirer = GreaseLoader._makeRequirer(this._resources);

  public require<T>(resourceId: string, definitionKey: string) {
    return this._requirer<T>(resourceId, definitionKey);
  }
}
