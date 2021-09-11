import type { RollupOptions } from "rollup";
import { promises as fs } from "fs";
import { getConfig, getPathVariables } from "./config";
import { allInputs } from "./inputs";
import type { IInput } from "./inputs/types";
import type { IInitialData, IIntermediateData } from "./types";
import { convert, ConvertionMethod, joinPosix } from "./utils/paths";
import { createCommonPluginsSet } from "./plugins";
import { assert, assertNotNull } from "./utils/assert";

const config = getConfig();

{
  // проверяет, чтобы сборка не запускалась внутри самой папки конфигураций.

  const isStartedInBuild = config.rootDir.startsWith(
    convert(__dirname, ConvertionMethod.SystemToPosix),
  );

  if (isStartedInBuild) {
    throw new Error("Do not run building in building system directory!");
  }
}

/**
 * Считывает единичные точки сборки из конфигурации и возвращает их объекты.
 *
 * @return Единичные точки сборки.
 */
function getInputs(): IInput[] {
  const value = config.inputs;

  assertNotNull(value, "Inputs never should be null.");
  assert(value.length !== 0, "There must be at least one input.");

  const inputs = value.split(",").map((item) => item.trim().toLowerCase());

  const result: IInput[] = [];

  for (const input of inputs) {
    if (input in allInputs) {
      result.push(allInputs[input as keyof typeof allInputs]);
    }
  }

  return result;
}

/**
 * Создаёт данные для сборки:
 * - добавляет первоначальные данные,
 * - добавляет переменные путей,
 * - считывает конфигурацию NPM пакета (`package.json`) из коревой директории.
 *
 * @return Данные для сборки.
 */
async function getIntermediateData(): Promise<IIntermediateData> {
  const initialData: IInitialData = {
    rootPackageJson: JSON.parse(
      await fs.readFile(joinPosix(config.rootDir, "package.json"), {
        encoding: "utf-8",
      }),
    ),

    pathVariables: getPathVariables(),
  };

  return {
    ...initialData,
    commonPluginsSet: createCommonPluginsSet(initialData),
  };
}

/**
 * Создаёт опции для сборки Rollup из всех единичных точек сборки.
 *
 * @return Опции сборки Rollup.
 */
async function inputsOptions() {
  const data = await getIntermediateData();
  const options: RollupOptions[] = [];

  for (const input of getInputs()) {
    const inputOptions = await Promise.resolve(
      input.optionDefinitions(config, data),
    );

    if (Array.isArray(inputOptions)) {
      options.push(...inputOptions);
    } else {
      options.push(inputOptions);
    }
  }

  return options;
}

export default inputsOptions;
