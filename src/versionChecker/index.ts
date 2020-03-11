import { getValueOrDefault, setValue } from "@utils/storage";
import { getWindow } from "@utils/window";
import { getVKTranslation } from "@utils/i18n";
import { getVKLanguage } from "@utils/i18n/vk";

const VERSION_SETTING = "lastVersion" as const;

const CURRENT_VERSION = "__currentVersion__";

const NEVER = "never" as const;

/**
 * Проверяет версию скрипта и сообщает пользователю об установленных
 * уведомлениях или предлагает ознакомиться с функционалом расширения
 */
export async function checkVersion() {
	const lastVersion = await getValueOrDefault<string>(VERSION_SETTING, NEVER);

	if (lastVersion === CURRENT_VERSION) return;

	const { versionChecker: translations } = getVKTranslation();

	await setValue(VERSION_SETTING, CURRENT_VERSION);

	const localeLink = (str: string) => str.replace("{}", getVKLanguage());

	if (lastVersion === NEVER) {
		getWindow().showDoneBox(localeLink(translations.installed));

		return;
	}

	getWindow().showDoneBox(localeLink(translations.updated));
}
