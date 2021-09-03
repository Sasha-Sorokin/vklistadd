import { h } from "preact";
import { getVKTranslation } from "@utils/i18n";
import { useCallback } from "preact/hooks";
import { asRoaming } from "@utils/freeComponents";
import { showBox } from "@/box";
import { ICON_NEWSFEED } from "@/assets";

const ICON_CONTENTS = ICON_NEWSFEED.source;

/**
 * @return Элемент меню для встраивания на страницах пользователей
 */
function ProfileMenuItem() {
	const { actionButton: translation } = getVKTranslation();

	const onClick = useCallback(() => showBox(undefined), []);

	return (
		<a
			className="PageActionCell"
			tabIndex={0}
			role="link"
			onClick={onClick}
		>
			<div
				className="PageActionCell__icon"
				// eslint-disable-next-line
				dangerouslySetInnerHTML={{
					// eslint-disable-next-line
					__html: ICON_CONTENTS,
				}}
			/>
			<span className="PageActionCell__label">{translation.text}</span>
		</a>
	);
}

/**
 * @return Функция для встраивания элемента меню
 */
export function getRoaming() {
	return asRoaming(<ProfileMenuItem />);
}
