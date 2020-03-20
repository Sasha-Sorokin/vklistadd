import { getWindow } from "@utils/window";
import { elem } from "@utils/dom";
import { toClassName } from "@utils/fashion";
import { log } from "@utils/debug";
import { PartialContext } from "@vk/scrapers";

const ITEM_HIGHLIGHT = toClassName("olistHighlight", {
	backgroundColor: "#e1e5eb",
});

const TOOLTIP_HIDE_TIME = 5000;

/**
 * Перенаправляет пользователя на страницу новостей и инициализирует
 * редактирования или создания нового списка
 *
 * @param listId ID списка, `-1` для создания нового списка
 * @param context Объект, для которого требуется создать список
 * @param translation Объект с текущими переводами
 * @param preSelect Должен ли элемент быть выбран заранее
 * @returns Успешность операции
 */
export function editList(
	listId: number,
	context: PartialContext,
	translation: ITranslation,
	preSelect: boolean = true,
) {
	const { id, icon, name, link } = context;

	if (id == null || icon == null || name == null || link == null) {
		log("warn", "[createList] Not sufficient data", {
			id, icon, name, link,
		});

		return false;
	}

	const window = getWindow();

	if (window.nav == null) {
		log("warn", "[createList] No nav fuction was found in window");

		return false;
	}

	// 1. Создаём фейковый класс компонента списков для того, чтобы
	//    отловить и заранее выбрать элемент объекта в нём

	const $OList = window.OList;

	const target = { id, icon, name, link };

	const { listCreation: { highlightTooltip } } = translation;

	const tooltipText = highlightTooltip.replace("{}", name);

	class FakeOList extends $OList {
		constructor(...args: ConstructorParameters<Window["OList"]>) {
			const [, list, selected] = args;

			window.OList = $OList;

			const targetIndex = list.findIndex(
				(listItem) => listItem[0] === target.id,
			);

			if (targetIndex === -1) {
				list.splice(0, 0, [
					target.id,
					target.name,
					target.icon,
					target.link,
					0,
				]);
			}

			selected[target.id] = preSelect ? 1 : 0;

			super(...args);

			const itemElem = elem<HTMLDivElement>(
				`#olist_item_wrap${target.id}`,
			);

			if (itemElem == null) return;

			itemElem.classList.add(ITEM_HIGHLIGHT);
			itemElem.scrollIntoView({ block: "center" });

			const avatarElem = elem<HTMLDivElement>(
				".olist_item_photo_wrap",
				itemElem,
			);

			if (avatarElem == null) return;

			getWindow().showTitle(avatarElem, tooltipText, undefined, {
				init(tooltip) {
					setTimeout(
						() => tooltip.hide(),
						TOOLTIP_HIDE_TIME,
					);
				},
			});
		}
	}

	// 2. Перенаправляем пользователя на страницу новостей и вызываем
	//    метод создания нового списка, который сконструирует наш OList

	window.nav.go("feed", null, {
		onDone() {
			window.OList = FakeOList;

			window.feed?.editList(listId);
		},
	});

	return true;
}
