import { getValueOrDefault, setValue } from "@utils/storage";
import { getWindow } from "@utils/window";
import { getVKTranslation } from "@utils/i18n";
import { getVKLanguage } from "@utils/i18n/vk";

const versionSetting = "lastVersion" as const;

const currentVersion = "__currentVersion__";

const NEVER = "never" as const;

/**
 * Проверяет версию скрипта и сообщает пользователю об установленных
 * обновлениях или предлагает ознакомиться с функционалом расширения
 */
export async function checkVersion() {
  const lastVersion = await getValueOrDefault<string>(versionSetting, NEVER);

  if (lastVersion === currentVersion) return;

  const { versionChecker: translations } = getVKTranslation();

  await setValue(versionSetting, currentVersion);

  const localeLink = (str: string) => str.replace("{}", getVKLanguage());

  if (lastVersion === NEVER) {
    getWindow().showDoneBox(localeLink(translations.installed));

    return;
  }

  getWindow().showDoneBox(localeLink(translations.updated));
}
