import { usePreventedCallback } from "@utils/hooks";
import { h } from "preact";
import { useContext } from "preact/hooks";
import { TranslationContext } from "@components/contexts/TranslationContext";
import { toStyleCombiner } from "@utils/fashion";
import { LOCK_COMBO } from "@common/css";
import { Title } from "@components/vk/Tooltip";
import { LinkButton } from "@components/vk/LinkButton";

const PLUS_ICON = "/images/icons/filter_add.png";

const STYLE = toStyleCombiner(
	{
		button: {
			marginTop: "10px",
			width: "max-content",
			lineHeight: "17px",
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
	},
	{
		locked: LOCK_COMBO,
	},
);

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const TOOLTIP_OFFSETS = [-10, 8] as const;

const CENTER_TOOLTIP = { center: true };

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
	onClick?(this: void): void;
}

/**
 * @param props Свойства ссылки
 * @return Ссылка на добавление нового списка
 */
export function AddListButton(props: IAddListButtonProps) {
	const { onClick } = props;
	const disabled = props.disabled ?? false;

	const onLinkClick = usePreventedCallback(disabled ? null : onClick);

	const { addListButton: translation } = useContext(TranslationContext);
	return (
		<Title
			text={translation.tooltip}
			shift={TOOLTIP_OFFSETS}
			opts={CENTER_TOOLTIP}
		>
			<LinkButton
				onClick={onLinkClick}
				className={STYLE("button", "locked", disabled)}
				children={translation.text}
			/>
		</Title>
	);
}
