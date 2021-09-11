import { createContext } from "@external/preact";
import type { PartialContext } from "@vk/scrapers";

export type ContextValue = PartialContext | undefined;

export const TargetContext = createContext<ContextValue>(undefined);
