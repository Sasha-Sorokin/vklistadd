import { SupportedModule } from "@vk/scrapers";

type ActionDispatch = (...args: any[]) => {
	type: string;
};

export type Actions<Action> = Action extends ActionDispatch
	? ReturnType<Action> : never;

/**
 * Отметить в свойствах Type под ключами Keys как допускающие null
 */
export type Nullable<Type, Keys extends keyof Type = keyof Type> = {
	[Key in Keys]: Type[Key] | null;
};

/**
 * Любой тип кроме null
 */
export type Diff<Type, Omitted> = Type extends Omitted ? never : Type;

/**
 * Исключить из свойств Type под ключами Keys тип null
 */
export type Ensured<Type, Keys extends keyof Type = keyof Type> = {
	[Key in keyof Type]: Key extends Keys
		? Diff<Type[Key], null>
		: Type[Key];
};

/**
 * Представляет собой контекст модуля
 */
export interface IModuleContext {
	/**
	 * Идентификатор модуля
	 */
	module: SupportedModule;
}

/**
 * Представляет собой стили компонента
 */
export type Style = { [property: string]: number | string } | string;

/**
 * Представляет собой объект на основе объекта `Base`, только со свойствами,
 * которые удовлетворяют `Condition`
 *
 * @see https://medium.com/dailyjs/9d902cea5b8c
 */
export type SubType<Base, Condition> = Pick<Base, {
	[Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

/**
 * Представляет собой хэш-карту
 */
export interface IHashMap<T> {
	[classKey: string]: T;
}

/**
 * Представляет собой функцию, которая принимает любые аргументы
 * и возвращает любое значение
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (this: any, ...args: any[]) => any;
