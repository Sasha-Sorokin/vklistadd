import { h } from "preact";
import { ITreating, TreatingKind } from "@vk/scrapers";
import { useCallback } from "preact/hooks";
import { showBox } from "@/box";
import { getVKTranslation } from "@utils/i18n";
import { asReplicable, MountFunction } from "@utils/freeComponents";

/**
 * Представляет собой свойства элемента меню
 */
export interface IActionsMenuItemProps {
	/**
	 * Объект для которого вызывается бокс изменения списков
	 */
	invoker: ITreating;
}

/**
 * @returns Элемент для меню действий в списке групп, закладок или друзей
 */
function ActionsMenuItem({ invoker }: IActionsMenuItemProps) {
	const onClick = useCallback(
		() => showBox(invoker),
		[invoker],
	);

	const { actionsMenuItem: { context } } = getVKTranslation();

	let itemText: string | null = null;

	switch (invoker.kind) {
		case TreatingKind.FeedRow: {
			itemText = context.feedRow;
		} break;

		default: {
			itemText = context.default;
		} break;
	}

	return (
		<a
			className="ui_actions_menu_item"
			role="link"
			tabIndex={0}
			onClick={onClick}
			children={itemText}
		/>
	);
}

let mountFunction: MountFunction<IActionsMenuItemProps>;

/**
 * @returns Функция для репликации и встраивания элемента меню
 */
export function getReplicable() {
	if (mountFunction == null) {
		mountFunction = asReplicable((props) => <ActionsMenuItem {...props} />);
	}

	return mountFunction;
}
