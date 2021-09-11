import {
  posix as $posixPath,
  win32 as $win32Path,
  default as $systemPath,
} from "path";
import { empty } from "./hashmap";
import { format } from "./placeholders";

/**
 * Возвращает путь в исходниках.
 *
 * @param args Пути, которые нужно добавить.
 * @return Путь в POSIX формате: ${src} и аргументы.
 */
export function fromSource(...args: string[]) {
  return $posixPath.join("$(src)", ...args);
}

/**
 * Возвращает путь в дистрибьюции.
 *
 * @param args Пути, которые нужно добавить.
 * @return Путь в POSIX формате: ${dist} и аргументы.
 */
export function inDistribution(...args: string[]) {
  return $posixPath.join("$(dist)", ...args);
}

/**
 * Свойства для резолюции путя.
 */
interface IPathOptions {
  /**
   * Если путь в результате должен быть POSIX путём.
   *
   * @default true
   */
  posix?: boolean;

  /**
   * Если ввод содержит POSIX-путь.
   *
   * По умолчанию соответствует системному значению.
   *
   * @default path.sep === "/"
   */
  inputPosix?: boolean;

  /**
   * Значения для переменных в путе.
   *
   * Переменные имеют формат `${property}`.
   */
  variables?: Record<string, string | null | undefined>;
}

const $defaultOpts: IPathOptions = {
  posix: true,
  inputPosix: $systemPath.sep === "/",
};

/**
 * Оформляет путь согласно переданным параметрам:
 *
 * - заменяет переменные;
 * - преобразует формат путей.
 *
 * @param _value Путь для оформления.
 * @param opts Параметры оформления
 * @return Оформленный путь.
 */
export function path(_value: string, opts?: IPathOptions) {
  let value = format(_value, opts?.variables ?? empty());

  if (opts != null) {
    const {
      inputPosix = $defaultOpts.inputPosix!,
      posix = $defaultOpts.posix!,
    } = opts;

    if (inputPosix !== posix) {
      value = value
        .split(inputPosix ? $posixPath.sep : $win32Path.sep)
        .join(posix ? $posixPath.sep : $win32Path.sep);

      // value = value.replace(inputPosix ? /\//g : /\\/g, posix ? "/" : "\\");
    }
  }

  return value;
}

/**
 * Объединяет переданные пути.
 *
 * Данная функция работает с POSIX-путями.
 *
 * @param paths Пути, которые необходимо объединить.
 * @return Объединённые пути.
 */
export function joinPosix(...paths: string[]) {
  return $posixPath.join(...paths);
}

/**
 * Объединяет переданные пути.
 *
 * Данная функция работает с системными путями.
 *
 * @param paths Пути, которые необходимо объединить.
 * @return Объединённые пути.
 */
export function joinSystem(...paths: string[]) {
  return $systemPath.join(...paths);
}

/**
 * Объединяет переданные пути.
 *
 * Данная функция работает с Win32-путями.
 *
 * @param paths Пути, которые необходимо объединить.
 * @return Объединённые пути.
 */
export function joinWin32(...paths: string[]) {
  return $win32Path.join(...paths);
}

/**
 * Метод преобразования путей.
 */
export enum ConvertionMethod {
  /**
   * Из POSIX путей в Win32 пути.
   */
  PosixToWin32 = "posix_to_win32",

  /**
   * Из Win32 путей в POSIX пути.
   */
  Win32ToPosix = "win32_to_posix",

  /**
   * Из определённых системой путей в POSIX пути.
   */
  SystemToPosix = "system_to_posix",

  /**
   * Из определённых системой путей в POSIX пути.
   */
  SystemToWin32 = "system_to_win32",
}

/**
 * Преобразует переданный путь выбранным методом.
 *
 * @param path Путь, который следует преобразовать.
 * @param method Способ преобразования пути.
 * @return Преобразованный путь.
 */
export function convert(path: string, method: ConvertionMethod) {
  const inputPosix =
    method === ConvertionMethod.PosixToWin32 ||
    ((method === ConvertionMethod.SystemToPosix ||
      method === ConvertionMethod.SystemToWin32) &&
      $systemPath.sep === $posixPath.sep);

  const outputPosix =
    method === ConvertionMethod.Win32ToPosix ||
    method === ConvertionMethod.SystemToPosix;

  if (inputPosix === outputPosix) return path;

  return path
    .split(inputPosix ? $posixPath.sep : $win32Path.sep)
    .join(outputPosix ? $posixPath.sep : $win32Path.sep);
}
