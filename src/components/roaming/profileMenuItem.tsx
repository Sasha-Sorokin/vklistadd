import { h } from "preact";
import { getVKTranslation } from "@utils/i18n";
import { useCallback } from "preact/hooks";
import { asRoaming } from "@utils/freeComponents";
import { showBox } from "@/box";

/**
 * @returns Элемент меню для встраивания на страницах пользователей
 */
function ProfileMenuItem() {
	const { actionButton: translation } = getVKTranslation();

	const onClick = useCallback(
		() => showBox(undefined),
		[],
	);

	return (
		<a
			className="page_actions_item"
			tabIndex={0}
			role="link"
			children={translation.text}
			onClick={onClick}
		/>
	);
}

/**
 * @returns Функция для встраивания элемента меню
 */
export function getRoaming() {
	return asRoaming(<ProfileMenuItem />);
}
