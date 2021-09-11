import { createLayeredProxy } from "proxy-layers";
import { create } from "./hashmap";

const read = Symbol("read");
const variableKeySymbol = Symbol("variableKey");
const variableOptionsSymbol = Symbol("variableOptions");

/**
 * Представляет собой стандартные опции для переменной окружения.
 */
export interface IVarOpts {
  /**
   * Следует ли игнорировать регистр названия переменной.
   *
   * @default true
   */
  ignoreNameCase?: boolean;

  /**
   * Следует ли игнорировать регистр значения переменной.
   *
   * @default true
   */
  ignoreValueCase?: boolean;
}

export const defaultVarOpts: IVarOpts = {
  ignoreNameCase: true,
  ignoreValueCase: true,
} as const;

/**
 * Предствавляет собой переменную окружения для использования внутри функции
 * парсинга.
 */
export interface IVariable<V> {
  /**
   * Название переменной.
   */
  [variableKeySymbol]: string;

  /**
   * Общие опции переменной окружения.
   */
  [variableOptionsSymbol]: IVarOpts;

  /**
   * Метод чтения переменной.
   *
   * @param value Значение переменной окружения.
   */
  [read](value: string | null): V;
}

type DefaultFunc<V> = (this: unknown, ...args: never[]) => V;
type Default<V> = V | DefaultFunc<V>;

/**
 * Возвращает значение по умолчанию.
 *
 * @param defaultValue Значение по умолчанию или функция, возвращающая его.
 * @return Значение по умолчанию.
 */
function getDefault<V>(defaultValue: Default<V>): V {
  return typeof defaultValue === "function"
    ? (defaultValue as DefaultFunc<V>)()
    : defaultValue;
}

// #region Custom

export const defaultCustomVarOpts: IVarOpts = {
  ...defaultVarOpts,
  ignoreValueCase: false,
};

/**
 * Создаёт репрезентацию переменной окружения с ручным считыванием значения для
 * использования в схематики считывания.
 *
 * @param key Название переменной окружения.
 * @param processor Функция считывания переменной.
 * @param opts Опции переменной окружения.
 * @return Репрезентация переменной окружения.
 */
export function customVar<V>(
  key: string,
  processor: (value: string | null) => V,
  opts = defaultCustomVarOpts,
): IVariable<V> {
  return {
    [variableKeySymbol]: key,
    [variableOptionsSymbol]: opts,
    [read](value) {
      return processor(value ?? null);
    },
  };
}

// #endregion

// #region String

/**
 * Создаёт репрезентацию текстовой переменной окружения для использования в
 * схематике считывания.
 *
 * @param key Название переменной окружения.
 * @param defaultValue Значение переменной окружения по умолчанию.
 * @param opts Опции считывания.
 * @return Репрезентация переменной окружения.
 */
export function stringVar(
  key: string,
  defaultValue: Default<string>,
  opts = defaultVarOpts,
): IVariable<string> {
  return customVar(key, (value) => value ?? getDefault(defaultValue), opts);
}

/**
 * Создаёт репрезентацию опциональной текстовой переменной окружения для
 * использования в схематики считывания.
 *
 * @param key Название переменной окружения.
 * @param opts Опции считывания.
 * @return Репрезентация переменной окружения.
 */
export function stringVarOptional(
  key: string,
  opts = defaultVarOpts,
): IVariable<string | null> {
  return customVar(key, (value) => value, opts);
}

// #endregion

// #region Number

/**
 * Представляет собой опции считывания численной переменной окружения.
 */
export interface INumberVarOpts extends IVarOpts {
  /**
   * Следует ли разрешить вариант "NaN".
   *
   * Если отключено, то переменная окружения установленная в значение "NaN"
   * будет считаться некорректной и значение по умолчанию или null будет
   * возвращено.
   *
   * Это не влияет на неправильные значения.
   *
   * @default false
   */
  allowNaN?: boolean;

  /**
   * Система счисления для передаваемого значения.
   *
   * @see {@link parseInt} Для информации о том, как работает этот параметр.
   * @default 10
   */
  radix?: number;

  /**
   * Следует ли считывать номер только как целое число, а не десятичное.
   *
   * Если {@link INumberVarOpts#radix} установлено на любое значение не равное
   * 10, то этот параметр теряет эффективность.
   *
   * @default false
   */
  intsOnly?: boolean;
}

const radix10 = 10;

export const defaultNumberVarOpts: INumberVarOpts = {
  ...defaultVarOpts,
  allowNaN: false,
  ignoreValueCase: false,
  radix: radix10,
  intsOnly: false,
};

/**
 * Считывает число из значения переменной.
 *
 * @param value Значение переменной окружения.
 * @param opts Опции для считывания.
 * @return Считанное значение или `null`, если считывание провалилось.
 */
function numberVarImpl(value: string, opts: INumberVarOpts): number | null {
  const { allowNaN = defaultNumberVarOpts.allowNaN! } = opts;

  if (value.toLowerCase() === "nan" && allowNaN) return NaN;

  const radix = opts.radix ?? defaultNumberVarOpts.radix!;

  let numberValue: number;

  if (radix === radix10) {
    if (opts.intsOnly ?? defaultNumberVarOpts.intsOnly!) {
      numberValue = parseInt(value, radix10);
    } else {
      numberValue = parseFloat(value);
    }
  } else {
    numberValue = parseInt(value, radix);
  }

  return Number.isNaN(numberValue) ? null : numberValue;
}

/**
 * Создаёт репрезентацию численной переменной окружения для использования в
 * схематике считывания.
 *
 * @param key Название переменной окружения.
 * @param defaultValue Значение переменной по умолчанию.
 * @param opts Опции считывания переменной.
 * @return Репрезентация переменной окружения.
 */
export function numberVar(
  key: string,
  defaultValue: Default<number>,
  opts = defaultNumberVarOpts,
): IVariable<number> {
  return customVar(
    key,
    (value) => {
      if (value == null) return getDefault(defaultValue);

      return numberVarImpl(value, opts) ?? getDefault(defaultValue);
    },
    opts,
  );
}

/**
 * Создаёт репрезентацию опциональной численной переменной окружения для
 * использования в схематике считывания.
 *
 * @param key Название переменной окружения.
 * @param opts Опции считывания переменной.
 * @return Репрезентация переменной окружения.
 */
export function numberVarOptional(
  key: string,
  opts = defaultNumberVarOpts,
): IVariable<number | null> {
  return customVar(
    key,
    (value) => (value == null ? null : numberVarImpl(value, opts)),
    opts,
  );
}

// #endregion

// #region Boolean

/**
 * Представляет собой опции считывания для булевой переменной окружения.
 */
export interface IBooleanVarOpts extends IVarOpts {
  /**
   * Дополнительные значения, которые воспринимаются как `true`.
   */
  trueVariants?: string[];

  /**
   * Дополнительные значения, которые воспринимаются как `false`.
   */
  falseVariants?: string[];
}

/**
 * Считывает булевую переменную окружения.
 *
 * @param value Значение для считывания.
 * @param opts Опции считывания.
 * @return Считанное булевое значение или `null`, если считывание провалилось.
 */
function booleanVarImpl(value: string, opts: IBooleanVarOpts): boolean | null {
  if (opts.falseVariants?.includes(value) ?? false) {
    return false;
  }

  if (opts.trueVariants?.includes(value) ?? false) {
    return true;
  }

  switch (value.toLowerCase()) {
    case "":
    case "true":
    case "yes":
    case "1":
      return true;

    case "false":
    case "no":
    case "0":
      return false;

    default:
      return null;
  }
}

/**
 * Создаёт репрезентацию булевой переменной окружения для использования в
 * схематике считывания.
 *
 * @param key Название переменной окружения.
 * @param defaultValue Значение переменной по умолчанию.
 * @param opts Опции считывания переменной.
 * @return Репрезентация переменной окружения.
 */
export function booleanVar(
  key: string,
  defaultValue: Default<boolean>,
  opts: IBooleanVarOpts = defaultVarOpts,
): IVariable<boolean> {
  return customVar(
    key,
    (value) => {
      if (value == null) return getDefault(defaultValue);

      return booleanVarImpl(value, opts) ?? getDefault(defaultValue);
    },
    opts,
  );
}

/**
 * Создаёт репрезентацию опциональной булевой переменной окружения для
 * использования в схематики считывания.
 *
 * @param key Название переменной окружения.
 * @param opts Опции считывания переменной.
 * @return Репрезентация переменной окружения.
 */
export function booleanVarOptional(
  key: string,
  opts: IBooleanVarOpts = defaultVarOpts,
): IVariable<boolean | null> {
  return customVar(
    key,
    (value) => (value == null ? null : booleanVarImpl(value, opts)),
    opts,
  );
}

// #endregion

type SchemaKey = string | symbol | number;

type Schema = Record<SchemaKey, IVariable<unknown>>;

type MapSchema<T extends Schema> = {
  [K in keyof T]: T[K] extends IVariable<infer Y> ? Y : never;
};

/**
 * Создаёт ключ для регистро-независимой переменной окружения.
 *
 * @param key Название переменной окружения.
 * @return Ключ для регистро-независимой переменной окружения.
 */
const caseIgnorantKey = (key: string) => `ENV:\x00${key.toLowerCase()}`;

type IndexedVariable = [environmentKey: string, variable: IVariable<unknown>];
type VariablesIndex = Record<SchemaKey, IndexedVariable[]>;
type LowerCaseIndex = Record<string, void>;

/**
 * Индексирует схематику для упрощенного считывания.
 *
 * @param schema Схематика для индексирования.
 * @return Кортёж из: индекса переменных и массива регистро-независимых ключей.
 */
function indexSchema<S extends Schema>(
  schema: S,
): [index: VariablesIndex, lowerCaseKeys: LowerCaseIndex] {
  const index: VariablesIndex = create();
  const lowerCaseKeys: LowerCaseIndex = create();

  for (const [schemaKey, variable] of Object.entries(schema)) {
    const ignoreKeyCase =
      variable[variableOptionsSymbol].ignoreNameCase ??
      defaultVarOpts.ignoreNameCase!;

    const key = ignoreKeyCase
      ? caseIgnorantKey(variable[variableKeySymbol])
      : variable[variableKeySymbol];

    if (ignoreKeyCase) lowerCaseKeys[key] = undefined;

    (index[schemaKey] ??= []).push([key, variable]);
  }

  return [index, lowerCaseKeys];
}

/**
 * Индексирует карту переменных окружения для упрощённого считывания.
 *
 * @param env Карта переменных окружения.
 * @param lowerCaseKeys Массив регистро-независимых ключей.
 * @return
 * Слоённая карта из переменных окружения и регистро-независимых переменных
 * окружения.
 */
function indexEnv(env: NodeJS.ProcessEnv, lowerCaseKeys: LowerCaseIndex) {
  const lowerCaseLayer: Record<string, string | undefined> = create();

  for (const [key, value] of Object.entries(env)) {
    const lowerCaseKey = caseIgnorantKey(key);

    if (lowerCaseKey in lowerCaseKeys) {
      lowerCaseLayer[lowerCaseKey] = value;
    }
  }

  return createLayeredProxy(env, lowerCaseLayer) as NodeJS.ProcessEnv;
}

/**
 * Подготавливает значение переменной окружения для его дальнейшего считывания.
 *
 * @param value Значение переменной окружения.
 * @param opts Базовые опция считывания.
 * @return Значение для дальнейшего считывания.
 */
function prepareValueForVariable(value: string | undefined, opts: IVarOpts) {
  if (value == null) return null;

  if (opts.ignoreValueCase ?? defaultVarOpts.ignoreValueCase!) {
    return value.toLowerCase();
  }

  return value;
}

/**
 * Считываниет переменные окружения согласно переданной схематике.
 *
 * @param schema Схематика переменных окружения.
 * @return Значения переменных окружения.
 */
export function readVars<S extends Schema>(schema: S) {
  const result: Record<SchemaKey, unknown> = create();

  const [varsIndex, lowerCaseKeys] = indexSchema(schema);

  const env = indexEnv(process.env, lowerCaseKeys);

  for (const [schemaKey, variables] of Object.entries(varsIndex)) {
    for (const [envKey, variable] of variables) {
      const value = prepareValueForVariable(
        env[envKey],
        variable[variableOptionsSymbol],
      );

      result[schemaKey] = variable[read](value);
    }
  }

  return result as MapSchema<S>;
}
