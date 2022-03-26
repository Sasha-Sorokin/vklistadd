// #region Стандартный сет плагинов

import license from "rollup-plugin-license";
import esbuild from "rollup-plugin-esbuild";
import fs from "fs";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { memo } from "../utils/memo";
import { path } from "../utils/paths";
import { typeScriptPathResolver } from "./typescript-path-resolver";
import type { IInitialData } from "../types";
import type { CommonPluginsSet } from "./types";

/**
 * Создаёт новый общий набор плагинов для использования в нескольких сборках
 * одновременно.
 *
 * Каждый плагин в наборе — memo-функция: то есть плагин создаётся только когда
 * он действительно нужен, а не каждый раз при вызове этого метода. Данный метод
 * просто привязывает создание к определённому набору данных.
 *
 * @param data Данные для создания общего набора плагинов.
 * @return Общий набор плагинов.
 */
export function createCommonPluginsSet(data: IInitialData): CommonPluginsSet {
  return {
    aliasResolver: memo(() =>
      typeScriptPathResolver(
        JSON.parse(
          fs.readFileSync(
            path("$(root)/tsconfig.json", {
              inputPosix: false,
              variables: data.pathVariables,
            }),
            { encoding: "utf-8" },
          ),
        ),
      ),
    ),

    invitationBanner: memo(() =>
      license({
        banner: {
          commentStyle: "ignored",
          content: {
            file: path("$(src)/meta/invitation.txt", {
              variables: data.pathVariables,
              inputPosix: true,
            }),
          },
        },
      }),
    ),

    esbuildNormal: memo(() =>
      esbuild({
        include: /\.[jt]sx?$/,
        exclude: /node_modules/,
        target: "es2017",
        tsconfig: path("$(root)/tsconfig.json", {
          inputPosix: true,
          variables: data.pathVariables,
        }),
        sourceMap: false,
      }),
    ),

    nodeResolve: memo(() => nodeResolve()),

    commonjs: memo(() => commonjs()),
  };
}
