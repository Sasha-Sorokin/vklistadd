import { SubType, Diff } from "@common/types";
import { wrapFunction, wrapProperty } from "./wrappers";
import { getWindow } from "./window";
import { log } from "./debug";

/**
 * Представляет собой подтип объекта окна, содержащего только модули ВКонтакте
 */
type VKModules = Omit<SubType<Window, VK.IModule | undefined>, "opener">;

/**
 * Представляет собой название модуля ВКонтакте
 */
type VKModuleName = Diff<keyof VKModules, undefined>;

/**
 * Представляет собой коллекцию отловщиков
 */
export type InterceptorsCollection = [
	VKModuleName,
	Parameters<typeof wrapFunction>[1],
][];

/**
 * Встраивает в объект окна отловщиков инициализации определённых модулей.
 * После отлова вызывает соответствующую функцию.
 *
 * @param interceptors Коллекция названий модулей и обработчиков инициализации
 */
export function setupInitInterceptors(interceptors: InterceptorsCollection) {
	const window = getWindow();

	for (const [moduleName, callbacks] of interceptors) {
		wrapProperty(window, moduleName, (newValue) => {
			if (newValue == null) return;

			const initFunciton = Reflect.get(newValue, "init");

			const initWrapper = wrapFunction(
				initFunciton.bind(newValue),
				callbacks,
			);

			Reflect.set(newValue, "init", initWrapper);

			log(
				"info",
				`Injected initialization interceptor to "${moduleName}"`,
			);
		});

		log("info", `Now watching for "${moduleName}" being defined.`);
	}
}
