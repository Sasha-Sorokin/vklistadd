import { h } from "preact";
import { ITreating, TreatingKind } from "@vk/scrapers";
import { useCallback } from "preact/hooks";
import { getVKTranslation } from "@utils/i18n";
import { asReplicable, MountFunction } from "@utils/freeComponents";
import { showBox } from "@/box";

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
 * @param props Свойства элемента меню
 * @return Элемент для меню действий в списке групп, закладок или друзей
 */
function ActionsMenuItem(props: IActionsMenuItemProps) {
	const { invoker } = props;

	const onClick = useCallback(() => showBox(invoker), [invoker]);

	const {
		actionsMenuItem: { context },
	} = getVKTranslation();

	let itemText: string | null = null;

	switch (invoker.kind) {
		case TreatingKind.FeedRow:
			itemText = context.feedRow;
			break;

		default:
			itemText = context.default;
			break;
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

let mountFunction: MountFunction<IActionsMenuItemProps> | null = null;

/**
 * @return Функция для репликации и встраивания элемента меню
 */
export function getReplicable() {
	if (mountFunction == null) {
		mountFunction = asReplicable((props) => <ActionsMenuItem {...props} />);
	}

	return mountFunction;
}
