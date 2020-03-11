import { createContext } from "preact";
import { getNavigatorTranslations } from "@utils/i18n";

export const TranslationContext = createContext(getNavigatorTranslations());
