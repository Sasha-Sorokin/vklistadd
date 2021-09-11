import { of } from "../utils/hashmap";
import userScriptInput from "./userscript";
import packsInput from "./packs";

export const allInputs = of([
  ["userscript", userScriptInput],
  ["packs", packsInput],
]);
