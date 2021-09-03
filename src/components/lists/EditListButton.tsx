import { h } from "preact";
import { useTarget, useTranslations } from "@utils/hooks";
import { toClassName } from "@utils/fashion";
import { useCallback, useMemo } from "preact/hooks";
import { editList } from "@vk/helpers/newsfeed";
import { IList } from "@vk/api/lists";
import { Title } from "@components/vk/Tooltip";
import { ICON_PEN } from "@/assets";

/**
 * Представляет собой свойства кнопки редактирования списка
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

	"&:hover, &:focus": { opacity: 1 },

	"& img": { height: "19px" },
});

/**
 * @param props Свойства кнопки редактирования списка
 * @return Кнопка редактирования списка
 */
export function EditListButton(props: IEditListButtonProps) {
	const { list } = props;
	const translation = useTranslations();
	const { text, icon } = translation.editListButton;
	const target = useTarget();
	const label = useMemo(() => text.replace("{}", list.name), [text, list]);

	const onClick = useCallback(() => {
		if (target == null) return;

		editList(list.id, target, translation, list.isSelected());
	}, [list, target, translation]);

	return (
		<Title text={label}>
			<button
				className={EDIT_BUTTON_CLASS}
				onClick={onClick}
				children={<img src={ICON_PEN.dataURL} alt={icon} />}
			/>
		</Title>
	);
}
