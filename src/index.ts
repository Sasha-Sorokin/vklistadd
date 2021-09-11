import { GreaseLoader } from "./gm/greaseLoader";
import type { DummyType } from "./_globals";
import type { IPlugin } from "./packs/plugin";

export type Globals = DummyType;

// eslint-disable-next-line userscript/no-window
const LOADER = new GreaseLoader(window);

LOADER.loadMultiple(["dependencies", "plugin"])
  .then(([resources]) => {
    const plugin = resources.get("plugin")?.get("plugin") as IPlugin | null;

    if (plugin == null) {
      throw new Error(
        "Plugin resource is not available. Has integrity check failed?",
      );
    }

    // plugin.initialize(resources.get("dependencies")!);
    plugin.initialize();
  })
  .catch((err) => {
    // Уменьшаем размер обёртки не включая в неё логгер
    // eslint-disable-next-line no-console
    console.error("[VKLISTADD] Cannot get dependencies", err);
  });
