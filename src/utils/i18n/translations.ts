import * as enUS from "../../i18n/en-US.yml";
import * as ruRU from "../../i18n/ru-RU.yml";

export const TRANSLATIONS = Object.freeze({
	"en-US": enUS,
	"ru-RU": ruRU,
});

export type LanguageCode = keyof typeof TRANSLATIONS;
