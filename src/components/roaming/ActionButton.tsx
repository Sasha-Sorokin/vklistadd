import { h } from "preact";
import { useCallback } from "preact/hooks";
import { MountFunction, asRoaming } from "@utils/freeComponents";
import { getVKTranslation } from "@utils/i18n";
import { toStyleCombiner } from "@utils/fashion";
import { GearIcon } from "@/assets";
import { showBox } from "@/box";

const ACTION_BUTTON_ACCENT = "#3f3f3f";

const STYLE = toStyleCombiner({
	actionMenuItem: {
		cursor: "pointer",
		color: `${ACTION_BUTTON_ACCENT} !important`,

		background: "none",
		border: "none",
		textAlign: "left",
		font: "inherit",

		width: "100%",

		"&::before": {
			"--icon": GearIcon.url,

			background: `${ACTION_BUTTON_ACCENT} !important`,
			mask: "var(--icon) !important",
			"-webkit-mask": "var(--icon) !important",
			opacity: "1 !important",
		},

		"&:hover": {
			textDecoration: "underline !important",
		},
	},
}, {
	vkActionMenuItem: "page_actions_item",
});

const CLASS_NAME = STYLE("vkActionMenuItem", "actionMenuItem");

/**
 * @returns Кнопка для правостороннего меню в группах и пабликах
 */
function ActionButton() {
	const onClick = useCallback(
		() => showBox(undefined),
		[],
	);

	return (
		// FIXME: please bind locale to inner [locale] "button" property
		// FIXME: add call to toggle box
		<button className={CLASS_NAME} onClick={onClick}>
			{getVKTranslation().actionButton.text}
		</button>
	);
}

let mountFunction: MountFunction<undefined>;

/**
 * @returns Функция для встраивания кнопки
 */
export function getRoaming() {
	if (mountFunction == null) {
		mountFunction = asRoaming(() => <ActionButton />);
	}

	return mountFunction;
}
