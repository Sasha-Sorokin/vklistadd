import { h, JSX } from "preact";
import { c, toClassName } from "@utils/fashion";

const LINK_BUTTON_CLASS = toClassName("linkButton", {
	background: "none",
	border: "none",
	font: "inherit",
	color: "#2a5885",
	cursor: "pointer",
	padding: "inherit",

	"&:hover, &:focus": { textDecoration: "underline" },
});

/**
 * @param props Обычные свойства кнопки
 *
 * @returns Кнопку стилизованную под ссылку
 */
export function LinkButton(props: JSX.IntrinsicElements["button"]) {
	const { className } = props;

	return <button {...props} className={c(LINK_BUTTON_CLASS, className)} />;
}
