import type { Requirer } from "@/gm/greaseLoader";

declare const require: Requirer;

const $simpleStyleJS = require<
  typeof import("simplestyle-js")
>("dependencies", "simplestyle-js");

export const { createStyles, rawStyles } = $simpleStyleJS;

export default $simpleStyleJS;
