import { LanguageCode, translations } from "./translations";

/**
 * Определяет язык, используемый браузером
 *
 * @return Кодовое название текущего языка или `null`,
 * если определение провалилось
 */
function detectNavigatorLanguage(): LanguageCode | null {
  for (const langCode of navigator.languages) {
    if (langCode in translations) return langCode as LanguageCode;
  }

  return null;
}

const navigatorLanguage = detectNavigatorLanguage() ?? "en-US";

/**
 * @return Код языка в браузере, для которого у нас имеются переводы
 */
export function getNavigatorLanguage() {
  return navigatorLanguage;
}

const navigatorTranslations = translations[getNavigatorLanguage()];

/**
 * @return Переводы для языка браузера
 */
export function getNavigatorTranslations() {
  return navigatorTranslations;
}
