import type { Plugin } from "rollup";

type CommonPluginNames =
  | "aliasResolver"
  | "invitationBanner"
  | "esbuildNormal"
  | "commonjs"
  | "nodeResolve";

export type CommonPluginsSet = Record<CommonPluginNames, () => Plugin>;
