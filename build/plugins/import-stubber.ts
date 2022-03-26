import type { Plugin } from "rollup";
import { uid } from "uid";
import { assertNotNull } from "../utils/assert";

/**
 * Опции для заглушки импорта.
 */
interface IImportStubOptions {
  /**
   * Импорты, для которых нужна заглушка.
   */
  imports: string[];

  /**
   * Код файла-заглушки.
   */
  stub?: string;
}

const stubIdUniqueCharacters = 20;

/**
 * Создаёт новый плагин для Rollup, чтобы вставить заглушки вместо файлов.
 *
 * @param options Опции для заглушки.
 * @return Плагин для Rollup.
 */
export function importStubber(options: IImportStubOptions): Plugin {
  assertNotNull(options, "importStubber used without options.");

  const { imports = [], stub = "export default undefined;" } = options;

  const stubId = `stubbed_import_${uid(stubIdUniqueCharacters)}`;

  return {
    name: "Import Stubber",
    resolveId(id: string) {
      return imports.includes(id) || id === stubId ? stubId : null;
    },
    load(id: string) {
      return id === stubId ? stub : null;
    },
  };
}

export default importStubber;
