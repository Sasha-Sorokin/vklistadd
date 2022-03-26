import type { Plugin } from "rollup";
import {
  CommentStyle,
  createGenerator,
  GeneratorOptionsInput,
  UserScriptMeta,
} from "userscript-header-generator";
import license from "rollup-plugin-license";

type StrippedGeneratorOptions = Omit<GeneratorOptionsInput, "commentStyle">;

/**
 * Представляет собой опции для Rollup плагина шапки UserScript.
 */
interface IUserScriptHeaderOptions {
  /**
   * Мета-данные пользовательского скрипта или функция, возвращающая их.
   */
  meta: UserScriptMeta | (() => UserScriptMeta);

  /**
   * Опции для генератора шапки.
   *
   * `commentStyle` убрана и заменяется на `"none"`.
   */
  generatorOptions: StrippedGeneratorOptions;

  /**
   * Следует ли генерировать карту исходного кода.
   */
  sourceMap?: boolean;
}

/**
 * Создаёт новый плагин Rollup, который встраивает шапку пользовательского
 * скрипта.
 *
 * @param opts Опции для плагина.
 * @return Плагин.
 */
export function userScriptHeader(opts: IUserScriptHeaderOptions): Plugin {
  const { generatorOptions, meta, sourceMap } = opts;

  const generate = createGenerator({
    ...generatorOptions,
    commentStyle: CommentStyle.None,
  });

  const bannerImpl = license({
    banner: {
      content: "<%= data.content %>",
      commentStyle: "slash",
      data() {
        return {
          content: generate(typeof meta === "function" ? meta() : meta),
        };
      },
    },
    sourcemap: sourceMap,
  });

  return {
    ...bannerImpl,
    name: "UserScript Header",
  };
}
