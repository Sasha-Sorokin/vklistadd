type LogLevel = "log" | "error" | "info" | "warn";

const [INITIAL, ...STYLES] = [
  "%c[VKLISTADD]%c",
  "color: white; background: green; font-weight: bold;",
  "",
];

/**
 * Выводит сообщение в консоли с фирменным префиксом™
 *
 * @param level Уровень сообщения
 * @param args Аргументы сообщения
 */
export function log<Level extends LogLevel>(
  level: Level,
  ...args: Parameters<typeof console[Level]>
) {
  const [message, ...rest] = args;

  if (typeof message === "string") {
    // eslint-disable-next-line no-console
    console[level](`${INITIAL} ${message}`, ...STYLES, ...rest);
  } else {
    // eslint-disable-next-line no-console
    console[level](INITIAL, ...STYLES, ...args);
  }
}
