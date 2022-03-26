import { elem, unwrapCSSValue, childrenOf } from "@utils/dom";
import { ITreating, TreatingKind, SupportedModule } from "./types";
import { findWithCallback, createTogglerHook } from "./utils/notifications";
import type { NotificationsTogglerHook } from "./types/notifications";

/**
 * @param treating Информация об альтернативном элементе
 * @return Статус подписки текущего пользователя на объект
 */
export function isFollowing(treating: ITreating): boolean | null {
  switch (treating.kind) {
    case TreatingKind.FriendRow:
    case TreatingKind.GroupRow: {
      // Науке не известно ни одного случая, в котором строчка
      // в списке подписок оказалась без подписки
      return true;
    }

    default:
      return null;
  }
}

const groupIdRegExp = /gl_groups(\d+)/;
const friendIdRegExp = /friends_user_row(\d+)/;

/**
 * @param treating Информация об альтернативном элементе
 * @return ID объекта внутри альтернативного элемента
 */
export function getID(treating: ITreating): number | null {
  const { element, kind } = treating;

  switch (kind) {
    case TreatingKind.FriendRow:
    case TreatingKind.GroupRow: {
      const isGroup = kind === TreatingKind.GroupRow;

      const regexp = isGroup ? groupIdRegExp : friendIdRegExp;

      const id = regexp.exec(element.id)?.[1];

      if (id == null) return null;

      return isGroup ? -Number(id) : Number(id);
    }

    case TreatingKind.Bookmark: {
      const { id } = (element as HTMLDivElement).dataset;

      return id != null ? +Number(id) : null;
    }

    case TreatingKind.FeedRow: {
      const postImg = elem<HTMLImageElement>(".post_img", element);

      if (postImg == null) return null;

      const { postId } = postImg.dataset;

      if (postId == null) return null;

      const [authorId] = postId.split("_");

      return Number(authorId);
    }

    default:
      return null;
  }
}

/**
 * @param treating Информация об альтернативном элементе
 * @return Ссылка на объект внутри альтернативного элемента
 */
export function getLink(treating: ITreating): string | null {
  const { element } = treating;

  switch (treating.kind) {
    case TreatingKind.GroupRow: {
      const link = elem("a.group_row_title", element);

      return (link as HTMLAnchorElement | null)?.href ?? null;
    }

    case TreatingKind.FriendRow: {
      const link = elem<HTMLAnchorElement>(
        ".friends_field.friends_field_title > a",
        element,
      );

      return link?.href ?? null;
    }

    case TreatingKind.Bookmark: {
      const link = elem<HTMLAnchorElement>(
        ".bookmark_page_item__name > a",
        element,
      );

      return link?.href ?? null;
    }

    case TreatingKind.FeedRow: {
      const link = elem<HTMLAnchorElement>("a.author", element);

      return link?.href ?? null;
    }

    default:
      return null;
  }
}

/**
 * @param treating Информация об альтернативном элементе
 * @return Иконка для объекта внутри альтернативного элемента
 */
export function getIcon(treating: ITreating): string | null {
  const { element, kind } = treating;

  switch (kind) {
    case TreatingKind.FriendRow:
    case TreatingKind.GroupRow: {
      const icon = elem<HTMLImageElement>(
        kind === TreatingKind.GroupRow
          ? ".group_row_img"
          : ".friends_photo_img",
        element,
      );

      return icon?.src ?? null;
    }

    case TreatingKind.Bookmark: {
      const icon = elem<HTMLDivElement>(".bookmark_page_item__image", element);

      const url = icon?.style.backgroundImage.slice("url(".length, -")".length);

      return url != null ? unwrapCSSValue(url) : null;
    }

    case TreatingKind.FeedRow: {
      const icon = elem<HTMLImageElement>(
        ".post_image > img.post_img",
        element,
      );

      return icon?.src ?? null;
    }

    default:
      return null;
  }
}

/**
 * @param treating Информация об альтернативном элементе
 * @return Название/имя объекта внутри альтернативного элемента
 */
export function getName(treating: ITreating): string | null {
  const { element } = treating;

  switch (treating.kind) {
    case TreatingKind.GroupRow: {
      const title = elem<HTMLAnchorElement>("a.group_row_title", element);

      return title?.textContent ?? null;
    }

    case TreatingKind.FriendRow: {
      const link = elem<HTMLAnchorElement>(".friends_field_title", element);

      return link?.textContent ?? null;
    }

    case TreatingKind.Bookmark: {
      const link = elem<HTMLAnchorElement>(
        ".bookmark_page_item__name > a",
        element,
      );

      return link?.textContent ?? null;
    }

    case TreatingKind.FeedRow: {
      const link = elem<HTMLAnchorElement>("a.author", element);

      return link?.textContent ?? null;
    }

    default:
      return null;
  }
}

/**
 * @param treating Информация об альтернативном элементе
 * @return Тип объекта внутри альтернативного элемента
 */
export function getType(treating: ITreating): SupportedModule | null {
  if (treating.subType != null) return treating.subType;

  // Можно предположить из ID, все минусовые ID принадлежат группам
  const id = getID(treating);

  if (id == null) return null;

  return id < 0 ? SupportedModule.Public : SupportedModule.Profile;
}

type OptionalHook = NotificationsTogglerHook | null;

const allTogglersHooks = new WeakMap<Element, OptionalHook>();

/**
 * @param treating Информация об альтернативном элементе
 * @return Переключатель уведомлений для альтернативного элемента
 */
export function getNotificationsToggler(treating: ITreating): OptionalHook {
  const { element, kind } = treating;

  let hook = allTogglersHooks.get(element);

  if (hook !== undefined) return hook;

  switch (kind) {
    case TreatingKind.GroupRow:
      {
        const children = childrenOf<HTMLElement>(
          elem(".ui_actions_menu", element),
        );

        if (children == null) break;

        const menuItem = findWithCallback(
          children,
          "onclick",
          "GroupsList.toggleSubscription",
        );

        if (menuItem != null) {
          hook = createTogglerHook(
            menuItem,
            () => menuItem.dataset.value === "1",
            () => menuItem.click(),
          );
        }
      }
      break;

    case TreatingKind.FeedRow:
      {
        const children = childrenOf<HTMLElement>(
          elem(".ui_action_menu", element),
        );

        if (children == null) break;

        const menuItem = findWithCallback(
          children,
          "onclick",
          "Feed.toggleSubscription",
        );

        if (menuItem != null) {
          hook = createTogglerHook(
            menuItem,
            () => menuItem.dataset.act === "1",
            () => menuItem.click(),
          );
        }
      }
      break;

    default:
      break;
  }

  hook = hook ?? null;

  allTogglersHooks.set(element, hook);

  return hook;
}
