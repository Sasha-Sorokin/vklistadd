import type { Requirer } from "@/gm/greaseLoader";

declare const require: Requirer;

const $debounce = require<
  typeof import("debounce")
>("dependencies", "debounce");

export const { debounce } = $debounce;

export default $debounce;
