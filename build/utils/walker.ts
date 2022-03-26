import { promises as fs } from "fs";
import { join } from "path";

/**
 * Функция-генератор, рекурсивно проходящая по каждому файлу в папке.
 *
 * @param path Путь, по которому необходимо пройтись.
 * @yields Путь файла.
 */
export async function* walkDirectoryRecursively(
  path: string,
): AsyncGenerator<string, void, void> {
  for await (const entry of await fs.opendir(path)) {
    const entryPath = join(path, entry.name);

    if (entry.isDirectory()) {
      yield* walkDirectoryRecursively(entryPath);
      continue;
    }

    yield entryPath;
  }
}
