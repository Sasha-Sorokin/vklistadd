import { getWindow } from "@utils/window";
import { errorMessages } from "@utils/errors";
import { LanguageCode, translations } from "./translations";
import { getNavigatorLanguage } from "./navigator";

const vkLanguageMappings: Record<number, LanguageCode | undefined> = {
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
    throw new Error(errorMessages.vkLanguageDetectFail);
  }

  return vkLanguageMappings[langConfig.id] ?? getNavigatorLanguage();
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
  return translations[getVKLanguage()];
}
