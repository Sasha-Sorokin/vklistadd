/* eslint-disable @typescript-eslint/no-restricted-imports */
// НЕ ИМПОРТИРУЙТЕ ЭТОТ ФАЙЛ САМОСТОЯТЕЛЬНО!
// =========================================
// Этот файл собирается отдельно и используется GreaseLoader-ом для определения
// зависимостей из NPM, некоторые из которых в сильно минифицированном виде,
// что запрещено правилами некоторых хостингов скриптов (Greasy Fork).

import * as preact from "preact";
import * as preactHooks from "preact/hooks";
import * as simpleStyleJs from "simplestyle-js";
import * as uid from "uid";
import debounce from "debounce";
import type { Definer } from "@/gm/greaseLoader";

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const define: Definer;

const definitions = {
  preact,
  "preact/hooks": preactHooks,
  "simplestyle-js": simpleStyleJs,
  debounce,
  uid,
} as const;

for (const [id, definition] of Object.entries(definitions)) {
  define(id, definition);
}
