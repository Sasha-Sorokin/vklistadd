import { h } from "preact";
import { useTarget, useTranslations } from "@utils/hooks";
import { toClassName } from "@utils/fashion";
import { EditPen } from "@/assets";
import { useCallback, useRef, useMemo } from "preact/hooks";
import { editList } from "@vk/helpers/newsfeed";
import { getWindow } from "@utils/window";
import { IList } from "@vk/api/lists";

/**
 * Свойства кнопки редактирования списка
 */
interface IEditListButtonProps {
	/**
	 * ID списка для запуска функции редактирования
	 */
	list: IList;
}

export const EDIT_BUTTON_CLASS = toClassName("editListButton", {
	border: 0,
	padding: 0,
	margin: 0,
	background: "none",
	cursor: "pointer",
	opacity: ".3",
	transition: "opacity .05s ease",
	height: "15px",

	"&:hover": { opacity: 1 },

	"& img": { height: "19px" },
});

/**
 * @returns Кнопка редактирования списка
 */
export function EditListButton({ list }: IEditListButtonProps) {
	const translation = useTranslations();
	const { text, icon } = translation.editListButton;
	const target = useTarget();
	const buttonRef = useRef<HTMLButtonElement>();

	const label = useMemo(() => text.replace("{}", list.name), [text, list]);

	const onClick = useCallback(() => {
		if (target == null) return;

		editList(list.id, target, translation, list.isSelected());
	}, [list, target, translation]);

	const onMouseOver = useCallback(() => {
		const { current: button } = buttonRef;

		if (button == null) return;

		getWindow().showTitle(button, label);
	}, [buttonRef, label]);

	return (
		<button
			aria-label={label}
			className={EDIT_BUTTON_CLASS}
			onClick={onClick}
			onMouseOver={onMouseOver}
			ref={buttonRef}
			children={<img src={EditPen.dataURL} alt={icon} />}
		/>
	);
}
