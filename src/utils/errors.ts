import { getNavigatorTranslations } from "@utils/i18n/navigator";

/**
 * Сообщения ошибок на языке браузера
 */
const MESSAGES = getNavigatorTranslations().errorMessages;

/**
 * @return Сгенерированные сообщения об ошибках, содержащие коды
 */
function generateErrorMessages(): Readonly<typeof MESSAGES> {
  const errorMessages = Object.create(null);

  for (const [key, message] of Object.entries(MESSAGES)) {
    errorMessages[key] = `[${key}] ${message}`;
  }

  return Object.freeze(errorMessages);
}

export const errorMessages = generateErrorMessages();
