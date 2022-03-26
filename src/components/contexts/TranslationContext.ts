import { createContext } from "@external/preact";
import { getNavigatorTranslations } from "@utils/i18n";

export const TranslationContext = createContext(getNavigatorTranslations());
