import type { AnyObj, MatchKeys, Member } from "@common/types";
import { log } from "@utils/debug";
import { errorMessages } from "./errors";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PropertyChangedCallback<ValueType> = (newValue: ValueType) => void;
type DescriptorOmit = "value" | "get" | "set" | "writable";
type DescriptorDefaults = Omit<PropertyDescriptor, DescriptorOmit>;

const defaultDescriptor: DescriptorDefaults = {
  configurable: true,
  enumerable: false,
};

/**
 * Оборачивает свойство объекта дескриптором, который вызывает переданный
 * обработчик при изменении свойства с новым значением
 *
 * @param obj Объект, свойство которого перехватывается
 * @param property Свойство для создания дескриптора
 * @param callback Обработчик, вызываемый при изменении значения
 * @param descriptor Конфигурация дескриптора
 */
export function wrapProperty<Obj extends AnyObj, Key extends keyof Obj>(
  obj: Obj,
  property: Key,
  callback: PropertyChangedCallback<Obj[Key]>,
  descriptor: DescriptorDefaults = defaultDescriptor,
) {
  let realValue = obj[property];

  Object.defineProperty(obj, property, {
    ...descriptor,
    get: () => realValue,
    set(newValue: Obj[Key]) {
      realValue = newValue;

      try {
        callback(newValue);
      } catch {
        // FIXME: should log here?
      }
    },
  });
}

type Fc = (...args: any[]) => any;

const wrappedFunctions = new Set<Fc>();

/**
 * Преставляет собой обработчики вызова функции
 *
 * @template Func Изначальная функция
 * @template Result Результат `preCallback`, передаваемый `postCallback`
 */
interface IFunctionCallbacks<Func extends Fc, Result> {
  /**
   * Обработчик, вызываемый до исполнения функции
   */
  preCallback(...args: Parameters<Func>): Result;

  /**
   * Обработчик, вызываемый после исполнения функции
   * с аргументами, которые вернуло исполнение `preCallback`
   */
  postCallback?(value: Result): void;
}

/**
 * @param func Функция, название которой нужно вернуть
 * @return Название функции `func`
 */
function getFunctionName<F extends () => any>(func: F) {
  const { name } = func;

  return name === "" ? "[anonymous function]" : name;
}

/**
 * Представляет собой тип, который принимает `Obj`, что наследует объект,
 * преобразуя его в список ключей, значение для которых наследует функцию
 *
 * @template Obj Объект для преобразования
 * @example
 * ```ts
 * const obj = {
 * 	prop: "value",
 * 	test() {
 * 		return false;
 * 	},
 * };
 *
 * type MethodsKeys = FunctionsOf<typeof obj>;
 * // => "test"
 * ```
 */
type FunctionsOf<Obj extends Record<Member, unknown>> = MatchKeys<Obj, Fc>;

/**
 * Привязывает и возвращает метод объекта
 *
 * @param obj Объект, метод которого необходимо вернуть
 * @param prop Название метода в объекте
 * @return Метод, привязанный к объекту
 * @example
 * ```ts
 * const boundGreet = getBound({
 * 	target: "world",
 * 	getGreeting() {
 * 		return `Hello, ${this.target}!`;
 * 	},
 * }, "getGreeting");
 *
 * console.log(boundGreet());
 * // => "Hello, world!"
 * ```
 */
export function getBound<
  Obj extends Record<Member, any>,
  Key extends FunctionsOf<Obj>,
>(obj: Obj, prop: Key): OmitThisParameter<Obj[Key]> {
  const func = obj[prop] as Fc;

  return func.bind(obj) as OmitThisParameter<Obj[Key]>;
}

/**
 * Создаёт обёртку для функции для дальнейшего присвоения и перехвата
 * аргументов вызова функции
 *
 * @param func Функция, для которой создаётся обёртка
 * @param callbacks Объект с обработчиками вызова функции
 * @param rejectChaining Создать исключение если переданная функция
 * уже является обёрткой
 * @return Обёртка, которую можно присвоить на место оригинальной функции
 */
export function wrapFunction<F extends Fc, V>(
  func: F,
  callbacks: IFunctionCallbacks<F, V> | Fc,
  rejectChaining = false,
): (...args: Parameters<F>) => ReturnType<F> {
  if (rejectChaining && wrappedFunctions.has(func)) {
    throw new Error(errorMessages.wrappingWrapper);
  }

  let resultWrapper: (...args: Parameters<F>) => ReturnType<F>;

  const funcName = getFunctionName(func);

  if (typeof callbacks === "function") {
    resultWrapper = function wrappedFunction(...args) {
      const result = func(...args);

      try {
        callbacks();
      } catch (err) {
        log("error", `Callback for ${funcName} has failed:`, {
          error: err,
          function: func,
          callbackFunction: callbacks,
        });
      }

      return result;
    };
  } else {
    resultWrapper = function wrappedFunction(...args) {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const { preCallback, postCallback } = callbacks;

      let beforeError: unknown | null = null;
      let beforeResult: { value: V } | null = null;
      let funcResult: { value: ReturnType<F> } | null = null;

      try {
        beforeResult = {
          value: preCallback(...args),
        };
      } catch (err) {
        beforeError = err;
      }

      funcResult = { value: func(...args) };

      if (beforeError != null) {
        log("error", `Callback for ${funcName} has failed:`, {
          error: beforeError,
          function: func,
          callback: preCallback,
        });
      }

      try {
        if (beforeError == null && beforeResult != null) {
          postCallback?.(beforeResult.value);
        }
      } catch (err) {
        log("error", `Post callback for ${funcName} has failed:`, {
          error: err,
          function: func,
          postCallback,
        });
      }

      return funcResult.value;
    };
  }

  wrappedFunctions.add(resultWrapper);

  return resultWrapper;
}
