import type { IInput } from "../types";
import { preparePacks } from "./config";

const input: IInput = {
  optionDefinitions(_buildCfg, data) {
    return [...Object.values(preparePacks(data))];
  },
};

export default input;
