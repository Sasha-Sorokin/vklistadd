import { h } from "preact";
import { useCallback } from "preact/hooks";
import { CheckboxRow } from "@components/vk/CheckboxRow";
import { IList } from "@vk/api/lists";
import { useForceUpdate } from "@utils/hooks";
import { toClassName } from "@utils/fashion";
import { EditListButton, EDIT_BUTTON_CLASS } from "./EditListButton";

/**
 * Представляет собой опции элемента списка
 */
export interface IListRowProps {
	/**
	 * Список, для которого создаётся флажок
	 */
	list: IList;

	/**
	 * Булевое значение, указывающее, отключён ли флажок
	 */
	disabled?: boolean;
}

const LIST_ROW_CLASS = toClassName("listRow", {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "start",

	[`&:hover .${EDIT_BUTTON_CLASS}`]: {
		opacity: 1,
	},
});

/**
 * @returns Флажок для определённого списка
 */
export function ListRow({ list, disabled }: IListRowProps) {
	const listSelected = list.isSelected();

	const update = useForceUpdate();

	const onChange = useCallback(
		(newValue: boolean) => {
			list.toggle(newValue);

			update();
		},
		[list, update],
	);

	return (
		<li className={LIST_ROW_CLASS}>
			<CheckboxRow
				checked={listSelected}
				text={list.name}
				onChange={onChange}
				disabled={disabled}
			/>

			<EditListButton list={list} />
		</li>
	);
}
