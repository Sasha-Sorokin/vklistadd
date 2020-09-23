import { elem, elems, asArray, insertBefore } from "@utils/dom";
import { getReplicable } from "@components/replicable/ActionsMenuItem";
import * as Interception from "@utils/interceptors";
import { log } from "@utils/debug";
import { getWindow } from "@utils/window";
import { TreatingKind, SupportedModule, ITreating } from "@vk/scrapers";
import { wrapFunction } from "@utils/wrappers";
import debounce from "debounce";

const MOUNT_MENU_ITEM = getReplicable();

/**
 * Определяет оптимальное место для встраивания элемента меню в зависимости
 * от типа меню
 *
 * @param menu Элемент меню
 * @param kind Объект, для которого создаётся элемент меню
 * @returns Родительский элемент или функция для встраивания
 */
function getMenuDisposition(menu: HTMLDivElement, kind: TreatingKind) {
	switch (kind) {
		case TreatingKind.Bookmark:
		case TreatingKind.GroupRow: {
			const separator = elem(".ui_actions_menu_sep", menu);

			if (separator == null) break;

			const referenceNode = kind === TreatingKind.Bookmark
				? separator
				: separator.nextSibling;

			if (referenceNode == null) return null;

			return (component: DocumentFragment) => insertBefore(
				referenceNode,
				component,
			);
		}

		default: break;
	}

	return menu;
}

/**
 * Встраивает элемент в меню, автоматически определяя оптимальное место
 *
 * @param invoker Информация об элементе, для которого создаётся меню
 */
function injectActionsMenuItem(invoker: ITreating) {
	const menu = elem<HTMLDivElement>(".ui_actions_menu", invoker.element);

	if (menu == null) {
		log("warn", "Not injecting menu item: couldn't find menu");

		return;
	}

	const disposition = getMenuDisposition(menu, TreatingKind.GroupRow);

	if (disposition == null) {
		log(
			"warn",
			"Not injecting menu item: was unable to find optimal disposition",
		);

		return;
	}

	MOUNT_MENU_ITEM(disposition, { invoker });
}

/**
 * Представляет собой массив закладок
 */
type Bookmarks = HTMLDivElement[];

/**
 * Представляет собой контекст для модуля закладок
 */
interface IBookmarksContext {
	/**
	 * Массив всех элементов закладок на странице
	 */
	pagesAll: Bookmarks;
}

/**
 * @returns Тип закладок по текущему фильтру
 */
function getBookmarksType() {
	const currentURL = new URL(getWindow().location.href);
	const currentType = currentURL.searchParams.get("type");

	switch (currentType) {
		case "group": return SupportedModule.Group;
		case "user": return SupportedModule.Profile;
		default: return null;
	}
}

/**
 * Встраивает во все меню рядом с закладками элемент настройки списков
 */
function mountBookmarksListMenuItems() {
	const currentType = getBookmarksType();

	if (currentType == null) return;

	const { pagesAll } = getWindow().cur as Partial<IBookmarksContext>;

	if (pagesAll == null) return;

	const proto = Object.getPrototypeOf(pagesAll) as Bookmarks;

	/**
	 * Закладки подгружаются не сразу после инициализации, поэтому мы не можем
	 * как обычно перебрать элементы на странице. Чтобы отловить все элементы,
	 * нужно создать обёртку над push функцией массива со всеми элементами
	 * закладок на странице.
	 *
	 * @param this Сам массив
	 * @param args Аргументы push функции
	 * @returns Результат push функции
	 */
	function pushInterceptor(
		this: Bookmarks,
		...args: Bookmarks
	) {
		const result = proto.push.apply(this, args);

		if (args === null || args.length === 0) return result;

		for (const arg of [...args]) {
			injectActionsMenuItem({
				element: arg,
				kind: TreatingKind.Bookmark,
				subType: currentType!,
			});
		}

		return result;
	}

	const newProto = Object.create(proto, {
		push: {
			value: pushInterceptor,
			writable: false,
			enumerable: false,
			configurable: true,
		},
	});

	Object.setPrototypeOf(pagesAll, newProto);
}

/**
 * Встраивает во все меню в списке групп или друзей элемент настройки списков
 *
 * @param kind Тип элементов для которых создаются элементы меню
 */
function mountRowsListMenuItems(kind: TreatingKind) {
	const container = elem<HTMLDivElement>(
		kind === TreatingKind.GroupRow
			? ".groups_list"
			: "#friends_list",
	);

	if (container == null) return;

	const groupRows = elems<HTMLDivElement>(
		kind === TreatingKind.GroupRow
			? ".group_list_row"
			: ".friends_user_row",
		container,
	);

	for (const row of asArray(groupRows)) {
		injectActionsMenuItem({
			element: row,
			kind,
			subType: kind === TreatingKind.GroupRow
				? SupportedModule.Public
				: SupportedModule.Profile,
		});
	}
}

// /**
//  * Проверяет, если переданный объект является постом
//  *
//  * @param item Элемент, который необходимо проверить
//  * @returns Является ли переданный элемент постом
//  */
// function isFeedPost(item: HTMLDivElement | null) {
// 	return item?.classList.contains("post") ?? false;
// }

// /**
//  * Проверяет, если переданный объект является репостом
//  *
//  * @param item Элемент, который необходимо проверить
//  * @returns Является ли переданный объект репостом
//  */
// function isFeedRepost(item: HTMLDivElement | null) {
// 	return item?.matches("[class^='feed_repost']") ?? false;
// }


// /**
//  * Обработчик события загрузки нового поста в ленте
//  *
//  * @param postRow Загруженный пост
//  */
// function onPostLoaded(postRow: HTMLDivElement) {
// 	let post = postRow.firstElementChild as HTMLDivElement | null;

// 	if (!isFeedPost(post)) {
// 		if (!isFeedRepost(post)) return;

// 		const repost = post?.firstElementChild as HTMLDivElement | null;

// 		if (!isFeedPost(repost)) return;

// 		post = repost;
// 	}

// 	injectActionsMenuItem({
// 		element: post!,
// 		kind: TreatingKind.FeedRow,
// 	});
// }


// Этот способ куда более эффективный, так как onPostLoaded вызывается
// не для всех постов, да и не всегда загруженные посты имеют одинаковый
// формат, из-за чего приходится много гадать поэтому просто пробегаемся
// по всем постам и проверяем, какие из них отсутствуют в наборе

const handledPosts = new WeakSet<HTMLDivElement>();

const HANDLE_DEBOUNCE = 50; // ms

/**
 * Обработчик события загрузки нового поста в ленте
 */
function onFeedRefresh() {
	const posts = elems<HTMLDivElement>(".feed_row .post");

	for (const post of asArray(posts)) {
		if (handledPosts.has(post)) continue;

		injectActionsMenuItem({
			element: post,
			kind: TreatingKind.FeedRow,
		});

		handledPosts.add(post);
	}
}

/**
 * Добавляет обёртку для обработчика события загрузки постов в ленте
 */
function addFeedRefreshHandler() {
	const feedModule = getWindow().feed;

	if (feedModule == null) return;

	type Handler = VK.IFeedModule["onPostLoaded"];

	let originalHandler = Reflect.get(feedModule, "onPostLoaded") as Handler;

	if (originalHandler == null) return;

	originalHandler = originalHandler.bind(feedModule);

	Reflect.set(
		feedModule,
		"onPostLoaded",
		wrapFunction(originalHandler, {
			preCallback: (post) => post,
			postCallback: debounce(onFeedRefresh, HANDLE_DEBOUNCE),
		}),
	);
}

const INTERCEPTORS: Interception.InterceptorsCollection = [
	["GroupsList", () => mountRowsListMenuItems(TreatingKind.GroupRow)],
	["Bookmarks", mountBookmarksListMenuItems],
	["Friends", () => mountRowsListMenuItems(TreatingKind.FriendRow)],
	["feed", addFeedRefreshHandler],
];

/**
 * Встраивает в объект окна отловщиков инициализации страницы списка групп
 * закладок и друзей. После отлова встраивает в меню на странице элемент,
 * открывающий окно изменения списков
 */
export function prepare() {
	Interception.setupInitInterceptors(INTERCEPTORS);
}
