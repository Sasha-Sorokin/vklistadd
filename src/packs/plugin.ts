import { ready } from "@utils/ready";
import { log } from "@utils/debug";
import { prepare as prepareGroupLike } from "../vk/injectors/groups";
import { prepare as prepareProfiles } from "../vk/injectors/profiles";
import { prepare as prepareMenus } from "../vk/injectors/menus";
import { checkVersion } from "../versionChecker/index";
import type { Definer } from "@/gm/greaseLoader";

declare const define: Definer;

/**
 * Инициализирует сам плагин
 */
function initialize() {
  log("log", "Preparing...");

  prepareGroupLike();
  prepareProfiles();
  prepareMenus();

  ready(() => {
    checkVersion()
      .then(() => log("info", "Version check complete!"))
      .catch((err) => log("error", "Version check failed", err));
  });

  log("info", "Ready.");
}

define("plugin", { initialize });

/**
 * Определение плагина
 */
export interface IPlugin {
  /**
   * Функция инициализации плагина
   */
  initialize: typeof initialize;
}
