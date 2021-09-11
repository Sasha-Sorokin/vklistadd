import type { Requirer } from "@/gm/greaseLoader";

declare const require: Requirer;

const $uid = require<typeof import("uid")>("dependencies", "uid");

export const { uid } = $uid;

export default $uid;
