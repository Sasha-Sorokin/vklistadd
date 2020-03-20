import { createContext } from "preact";
import { PartialContext } from "@vk/scrapers";

type ContextValue = PartialContext | undefined;

export const TargetContext = createContext<ContextValue>(undefined);
