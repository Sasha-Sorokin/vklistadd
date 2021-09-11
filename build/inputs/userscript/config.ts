/* eslint-disable import/no-extraneous-dependencies */
import {
  CommentStyle,
  GeneratorOptionsInput,
  HashType,
  ResourceDescriptor,
  RunAt,
  UserScriptMeta,
} from "userscript-header-generator";
import git from "isomorphic-git";
import fs from "fs";
import type { PackageJson } from "types-package-json";
import { posix as $path } from "path";
import type { ExcludeNullables, IUserScriptConfig } from "./types";
import { inDistribution, path } from "../../utils/paths";
import type { IConfig, IIntermediateData } from "../../types";

/**
 * Шаблон для ссылок на отдельные ресурсы.
 */
const resourceUrl = "https://cdn.jsdelivr.net/gh/{repo}@{commit}/{file}";

const meta = (config: IConfig, pkg: PackageJson): UserScriptMeta => ({
  name: {
    "@": "VK List Add",
    ru: "VK Добавление в списки",
  },
  description: {
    "@": "Adds buttons to add communities or users to newsfeed lists without subscribing to them",
    ru: "Добавляет кнопки для добавления сообществ или пользователей в списки новостей без подписки.",
  },
  version: pkg.version,
  author: pkg.author ?? "Unknown author",
  license: pkg.license,
  contributors: pkg.contributors,
  namespace: `${config.githubServer}/${config.githubRepo}`,
  homepage: pkg.homepage,
  supportUrl: pkg.bugs?.url,
  updateUrl: `${config.githubServer}/${config.githubRepo}/releases/latest/download/vklistadd.user.js`,
  include: ["https://vk.com/*"],
  runAt: RunAt.DocumentStart,
  noFrames: true,
  grant: [
    "unsafeWindow",
    "GM.setValue",
    "GM_setValue",
    "GM.getValue",
    "GM_getValue",
    "GM.getResourceText",
    "GM_getResourceText",
  ],
  resources: [
    {
      id: "dependencies",
      hash: ["auto", HashType.SHA256],
    },
    {
      id: "plugin",
      hash: ["auto", HashType.SHA256],
    },
  ],
});

/**
 * Создаёт опции для генератора шапки пользовательского скрипта.
 *
 * @param buildConfig Конфигурация сборки.
 * @param data Данные сборки.
 * @return Опции для генератора шапки пользовательского скрипта.
 */
async function generatorOptions(
  buildConfig: IConfig,
  data: IIntermediateData,
): Promise<ExcludeNullables<GeneratorOptionsInput>> {
  const { ref, githubRepo } = buildConfig;

  const commit = await git.resolveRef({ fs, dir: process.cwd(), ref });

  // eslint-disable-next-line no-console
  console.log(`Resolved ${ref} to ${commit}...`);

  // NOTE(Braw): isomorphic-git содержит неправильные типы.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (commit == null)
    throw new Error("Is not a git repository or ref is not valid");

  return {
    commentStyle: CommentStyle.None,
    resolveResourceSrc(descriptor: ResourceDescriptor) {
      return path(inDistribution(`${descriptor.id}.js`), {
        inputPosix: true,
        variables: data.pathVariables,
      });
    },
    resolveResourceUrl(descriptor: ResourceDescriptor) {
      let remoteFile = descriptor.src;

      if (remoteFile == null) {
        remoteFile = `${descriptor.id}.js`;
      } else {
        remoteFile = $path.normalize(remoteFile);
      }

      remoteFile = $path.relative(buildConfig.rootDir, remoteFile);

      // NOTE(Braw): это подразумевает, что коммит уже создан и содержит нужный
      // файл. поэтому билды, скорее всего, придётся делать отдельно, но я давно
      // хотел сделать автоматическую сборку через GitHub Actions, так что это
      // не должно быть проблемой?
      return resourceUrl
        .replace("{repo}", githubRepo)
        .replace("{commit}", commit)
        .replace("{file}", remoteFile)
        .replace("{filename}", $path.basename(remoteFile));
    },
  };
}

export default {
  meta,
  generatorOptions,
} as IUserScriptConfig;
