import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import type { IInput } from "../types";
import { fromSource, inDistribution, path } from "../../utils/paths";
import config from "./config";
import { userScriptHeader } from "../../plugins/userscript-header";

const input: IInput = {
  async optionDefinitions(buildCfg, data) {
    const { rootPackageJson, pathVariables, commonPluginsSet } = data;

    return defineConfig({
      input: path(fromSource("index.ts"), {
        inputPosix: true,
        variables: pathVariables,
      }),

      output: [
        {
          file: path(inDistribution("vklistadd.user.js"), {
            inputPosix: true,
            variables: pathVariables,
          }),

          format: "iife",
        },
      ],

      plugins: [
        commonPluginsSet.aliasResolver(),
        commonPluginsSet.esbuildNormal(),
        commonPluginsSet.invitationBanner(),
        nodeResolve({
          resolveOnly: ["proxy-layers"],
        }),
        commonPluginsSet.commonjs(),
        userScriptHeader({
          generatorOptions: await Promise.resolve(
            config.generatorOptions(buildCfg, data),
          ),
          meta: () => config.meta(buildCfg, rootPackageJson),
        }),
      ],
    });
  },
};

export default input;
