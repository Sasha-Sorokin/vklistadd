import { assertNotNull } from "./assert";
import { empty, Entry, of } from "./hashmap";

const makePlaceholderRegExp = () => /(?<!\\)\$\((?<name>.+?)(?<!\\)\)/g;

/**
 * Заменяет все заполнители в строке на соответствующие им значения.
 *
 * ### Формат заполнителей
 *
 * Заполнители имеют оформление `$(название)`. Внутри скобок допускается
 * любая последовательность символов, представляющая собой название, кроме
 * закрывающей скобки (`)`) — их необходимо экранировать символом `\`.
 *
 * @param _value Строка для замены заполнителей.
 * @param _variables Значения для заменяемых заполнителей.
 * @return Строка с заменёнными заполнителями.
 * @example
 * const map = Object.create(null);
 * map[];
 * format("$(test) $(test 2) $(test (but it's weird\\))");
 * // =>
 */
export function format(
  _value: string,
  _variables: Record<string, string> | Entry<string, string>[] = empty(),
) {
  let value = _value;

  const variables = Array.isArray(_variables) ? of(_variables) : _variables;

  const variableRegExp = makePlaceholderRegExp();

  let currentMatch: RegExpExecArray | null = null;

  while ((currentMatch = variableRegExp.exec(value)) != null) {
    const variableName = currentMatch.groups!.name.replace(/\\\}/g, "}");

    const replacement = variables[variableName];

    assertNotNull(replacement, 'Unresolved variable "%s"', variableName);

    const before = value.substring(0, currentMatch.index);

    const after = value.substring(currentMatch.index + currentMatch[0].length);

    value = `${before}${replacement}${after}`;
  }

  return value;
}
