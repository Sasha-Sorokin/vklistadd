import { defineConfig, RollupOptions } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import image from "@rollup/plugin-image";
import yaml from "@rollup/plugin-yaml";
import alias from "@rollup/plugin-alias";
import replace from "@rollup/plugin-replace";
import { of } from "../../utils/hashmap";
import { fromSource, inDistribution, path } from "../../utils/paths";
import importStubber from "../../plugins/import-stubber";
import type { IIntermediateData } from "../../types";

/**
 * Создаёт опции для определённых паков.
 *
 * @param data Данные сборки.
 * @return Хэш-карта с опциями Rollup для каждого пака.
 */
export function preparePacks(
  data: IIntermediateData,
): Record<string, RollupOptions> {
  const { commonPluginsSet, pathVariables } = data;

  const { NODE_ENV: nodeEnv = "development" } = process.env;

  return of([
    [
      "dependencies",
      defineConfig({
        input: path(fromSource("packs/dependencies.ts"), {
          inputPosix: true,
          variables: pathVariables,
        }),

        output: [
          {
            file: path(inDistribution("dependencies.js"), {
              inputPosix: true,
              variables: pathVariables,
            }),
            format: "iife",
          },
        ],

        plugins: [
          alias({
            entries: {
              react: require.resolve("preact/compat"),
              "react-dom": require.resolve("preact/compat"),
            },
          }),
          commonPluginsSet.aliasResolver(),
          commonPluginsSet.nodeResolve(),
          esbuild({
            include: /\.[jt]sx?$/,
            exclude: /node_modules/,
            sourceMap: false,
            target: "es2017",
            legalComments: "inline",
            minify: nodeEnv === "production",
          }),
          replace({
            values: {
              // NOTE(Braw): исправление для некоторых библиотек
              "process.env.NODE_ENV": JSON.stringify(nodeEnv),
            },
            preventAssignment: true,
          }),
          commonPluginsSet.commonjs(),
        ],
      }),
    ],
    [
      "plugin",
      defineConfig({
        input: path(fromSource("packs/plugin.ts"), {
          variables: data.pathVariables,
        }),

        output: [
          {
            file: path(inDistribution("plugin.js"), {
              variables: data.pathVariables,
            }),
            format: "iife",
          },
        ],

        plugins: [
          importStubber({
            imports: ["preact/src/jsx"],
            stub: "export const JSXInternal = undefined;",
          }),
          commonPluginsSet.aliasResolver(),
          commonPluginsSet.esbuildNormal(),
          image(),
          yaml(),
          commonPluginsSet.invitationBanner(),
        ],
      }),
    ],
  ]);
}
