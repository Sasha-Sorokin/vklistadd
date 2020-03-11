import { ERROR_MESSAGES, log } from "@utils/debug";

/* eslint-disable @typescript-eslint/no-explicit-any */
type PropertyChangedCallback<T> = (newValue: T) => void;
type DescriptorOmit = "value" | "get" | "set" | "writable";
type DescriptorDefaults = Omit<PropertyDescriptor, DescriptorOmit>;

/**
 * Оборачивает свойство объекта дескриптором, который вызывает переданный
 * обработчик при изменении свойства с новым значением
 *
 * @param obj Объект, свойство которого перехватывается
 * @param property Свойство для создания дескриптора
 * @param callback Обработчик, вызываемый при изменении значения
 * @param descriptor Конфигурация дескриптора
 */
export function wrapProperty<T extends object, K extends keyof T>(
	obj: T,
	property: K,
	callback: PropertyChangedCallback<T[K]>,
	descriptor?: DescriptorDefaults,
) {
	let realValue = obj[property];

	Object.defineProperty(obj, property, {
		...descriptor,
		get: () => realValue,
		set(newValue: T[K]) {
			realValue = newValue;

			try {
				callback(newValue);
			} catch {
				// FIXME: should log here?
			}
		},
	});
}

type Function = (...args: any[]) => any;

const WRAPPED_FUNCTIONS = new Set<Function>();

/**
 * Преставляет собой обработчики вызова функции
 */
interface IFunctionCallbacks<F extends Function, V> {
	/**
	 * Обработчик, вызываемый до исполнения функции
	 */
	preCallback(...args: Parameters<F>): V;

	/**
	 * Обработчик, вызываемый после исполнения функции
	 * с аргументами, которые вернуло исполнение `preCallback`
	 */
	postCallback?(value: V): void;
}

/**
 * @param func Функция, название которой нужно вернуть
 * @returns Название функции `func`
 */
function getFunctionName<F extends () => any>(func: F) {
	const { name } = func;

	return name === "" ? "[anonymous function]" : name;
}

/**
 * Создаёт обёртку для функции для дальнейшего присвоения и перехвата
 * аргументов вызова функции
 *
 * @param func Функция, для которой создаётся обёртка
 * @param callbacks Объект с обработчиками вызова функции
 * @param rejectChaining Создать исключение если переданная функция
 * уже является обёрткой
 * @returns Обёртка, которую можно присвоить на место оригинальной функции
 */
export function wrapFunction<F extends Function, V>(
	func: F,
	callbacks: IFunctionCallbacks<F, V> | Function,
	rejectChaining = false,
): (...args: Parameters<F>) => ReturnType<F> {
	if (rejectChaining && WRAPPED_FUNCTIONS.has(func)) {
		throw new Error(ERROR_MESSAGES.WRAPPING_A_WRAPPER);
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
		const { preCallback, postCallback } = callbacks;

		resultWrapper = function wrappedFunction(...args) {
			let preFail: Error | undefined;
			let preResult: { value: V } | null = null;
			let funcResult: { value: ReturnType<F> } | null = null;

			try {
				preResult = {
					value: preCallback(...args),
				};
			} catch (err) {
				preFail = err;
			}

			funcResult = { value: func(...args) };

			if (preFail != null) {
				log("error", `Callback for ${funcName} has failed:`, {
					error: preFail,
					function: func,
					callback: preCallback,
				});
			}

			try {
				if (preFail == null && preResult != null) {
					postCallback?.(preResult.value);
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

	WRAPPED_FUNCTIONS.add(resultWrapper);

	return resultWrapper;
}
