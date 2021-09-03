import { LanguageCode, TRANSLATIONS } from "./translations";

/**
 * Определяет язык, используемый браузером
 *
 * @return Кодовое название текущего языка или `null`,
 * если определение провалилось
 */
function detectNavigatorLanguage(): LanguageCode | null {
	for (const langCode of navigator.languages) {
		if (langCode in TRANSLATIONS) return langCode as LanguageCode;
	}

	return null;
}

const NAVIGATOR_LANGUAGE = detectNavigatorLanguage() ?? "en-US";

/**
 * @return Код языка в браузере, для которого у нас имеются переводы
 */
export function getNavigatorLanguage() {
	return NAVIGATOR_LANGUAGE;
}

const NAVIGATOR_TRANSLATIONS = TRANSLATIONS[getNavigatorLanguage()];

/**
 * @return Переводы для языка браузера
 */
export function getNavigatorTranslations() {
	return NAVIGATOR_TRANSLATIONS;
}
