import { usePreventedCallback } from "@utils/hooks";
import { h } from "preact";
import { getWindow } from "@utils/window";
import { useRef, useContext, useCallback } from "preact/hooks";
import { TranslationContext } from "@components/contexts/translationContext";
import { toStyleCombiner } from "@utils/fashion";
import { LOCK_COMBO } from "@common/css";

const PLUS_ICON = "/images/icons/filter_add.png";

const STYLE = toStyleCombiner({
	button: {
		marginTop: "10px",
		width: "max-content",
		lineHeight: "19px",
		cursor: "pointer",
		display: "block",

		"&::before": {
			content: "''",
			background: `url("${PLUS_ICON}") 1px 3px no-repeat`,
			width: "15px",
			height: "15px",
			float: "left",
			margin: "0 7px 0 0",
		},
	},
}, {
	locked: LOCK_COMBO,
});

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const TOOLTIP_OFFSETS = [-10, 8] as const;

/**
 * Представляет собой свойства ссылки
 */
export interface IAddListButtonProps {
	/**
	 * Ссылка отключена и не отзывается на клики
	 */
	disabled?: boolean;

	/**
	 * Обработчик нажатия на ссылку
	 */
	onClick?(): void;
}

/**
 * @param props Свойства ссылки
 * @returns Ссылка на добавление нового списка
 */
export function AddListButton({ onClick, ...props }: IAddListButtonProps) {
	const button = useRef<HTMLAnchorElement>();

	const disabled = props.disabled ?? false;

	const onLinkClick = usePreventedCallback(disabled ? null : onClick);

	const { addListButton: translation } = useContext(TranslationContext);

	const showTooltip = useCallback(() => {
		if (button.current == null) return;

		getWindow().showTitle(
			button.current,
			translation.tooltip,
			TOOLTIP_OFFSETS,
			{ center: true },
		);
	}, [translation.tooltip]);

	return (
		<a
			onClick={onLinkClick}
			onMouseOver={showTooltip}
			ref={button}
			className={STYLE("button", "locked", disabled)}
			children={translation.text}
		/>
	);
}
