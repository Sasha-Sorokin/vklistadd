import nodeResolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import type { Plugin } from "rollup";
import path from "path";

/**
 * Представляет собой срез конфигурации TypeScript.
 */
interface ITSConfigSlice {
  /**
   * Опции компиляции.
   */
  compilerOptions: {
    /**
     * Алиасы резолюции модулей.
     */
    paths: Record<string, string[]>;
  };
}

/**
 * Создаёт плагин для резолюции модулей с помощью алиасов, определённых через
 * конфигурацию TypeScript.
 *
 * @param tsConfig Срез конфигурации TypeScript.
 * @return Плагин Rollup.
 */
export function typeScriptPathResolver(tsConfig: ITSConfigSlice) {
  return alias({
    customResolver: ((resolver: Plugin) => ({
      resolveId: resolver.resolveId!,
      buildStart: resolver.buildStart,
    }))(nodeResolve({ extensions: [".tsx", ".ts"] })),

    entries: Object.entries(tsConfig.compilerOptions.paths).map(
      ([alias, value]) => ({
        find: new RegExp(`${alias.replace("/*", "")}`),
        replacement: path.resolve(`${value[0].replace("/*", "")}`),
      }),
    ),
  });
}
