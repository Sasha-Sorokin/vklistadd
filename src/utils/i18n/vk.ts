import { getWindow } from "@utils/window";
import { ERROR_MESSAGES } from "@utils/debug";
import { IHashMap } from "@common/types";
import { LanguageCode, TRANSLATIONS } from "./translations";
import { getNavigatorLanguage } from "./navigator";

const VK_LANGUAGE_MAPPINGS: IHashMap<LanguageCode | undefined> = {
	0: "ru-RU",
	777: "ru-RU",
	100: "ru-RU",
	1: "ru-RU",
	3: "en-US",
};

/**
 * Определяет используемый язык ВКонтакте
 *
 * @throws Если функция вызвана слишком рано и langConfig ещё
 * не был объявлен в объекте окна
 * @return Код языка, для которого у нас есть перевод
 */
function detectVKLanguage() {
	const { langConfig } = getWindow();

	// проверка на правильное состояние
	if ((langConfig as unknown) == null) {
		throw new Error(ERROR_MESSAGES.vkLanguageDetectFail);
	}

	return VK_LANGUAGE_MAPPINGS[langConfig.id] ?? getNavigatorLanguage();
}

let vkLanguage: LanguageCode | null = null;

/**
 * @return Язык, выбранный в ВКонтакте
 */
export function getVKLanguage() {
	if (vkLanguage == null) {
		vkLanguage = detectVKLanguage();
	}

	return vkLanguage;
}

/**
 * @return Переводы для языка, выбранного во ВКонтакте
 */
export function getVKTranslation() {
	return TRANSLATIONS[getVKLanguage()];
}
