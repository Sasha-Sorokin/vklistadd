import { log } from "@utils/debug";
import { getWindow } from "@utils/window";
import { DummyType } from "./_globals";
import { prepare as prepareGroupLike } from "./vk/injectors/groups";
import { prepare as prepareProfiles } from "./vk/injectors/profiles";
import { prepare as prepareMenus } from "./vk/injectors/menus";
import { checkVersion } from "./versionChecker";

export type Globals = DummyType;

log("log", "Preparing...");

prepareGroupLike();
prepareProfiles();
prepareMenus();

getWindow().addEventListener("load", () => {
	checkVersion()
		.then(() => log("info", "Version check complete!"))
		.catch((err) => log("error", "Version check failed", err));
});

log("info", "Ready.");
