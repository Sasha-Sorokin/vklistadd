import type { IConfig } from "./types";
import {
  customVar,
  readVars,
  stringVar,
  stringVarOptional,
} from "./utils/environment";
import { of } from "./utils/hashmap";
import { convert, ConvertionMethod, joinPosix } from "./utils/paths";

const cwd = convert(process.cwd(), ConvertionMethod.SystemToPosix);

const env = readVars({
  rootDir: customVar("root_dir", (value) => {
    if (value == null) return cwd;

    return convert(value, ConvertionMethod.SystemToPosix);
  }),
  inputs: stringVar("inputs", "packs, userscript"),
  githubServer: stringVarOptional("github_server_url"),
  githubRepo: stringVarOptional("github_repository"),
  githubRef: stringVarOptional("github_ref"),
  bindCommit: stringVarOptional("bind_commit"),
  isProduction: customVar("node_env", (v) => v === "production"),
});

const config: IConfig = {
  rootDir: env.rootDir,
  srcDir: joinPosix(env.rootDir, "src"),
  distDir: joinPosix(env.rootDir, "dist/built"),
  githubServer: "https://github.com",
  githubRepo: env.githubRepo ?? "Sasha-Sorokin/vklistadd",
  ref: env.bindCommit ?? env.githubRef ?? "HEAD",
  inputs: env.inputs,
  isProduction: env.isProduction,
};

// #region Config implementation

const pathVariables = Object.freeze(
  of([
    ["root", config.rootDir],
    ["src", config.srcDir],
    ["dist", config.distDir],
  ]),
);

/**
 * ## Только для внутреннего использования.
 *
 * @return Переменные путей.
 */
export function getPathVariables() {
  return pathVariables;
}

/**
 * ## Только для внутреннего использования.
 *
 * @return Конфигурация сборки.
 */
export function getConfig() {
  return config;
}

// #endregion
