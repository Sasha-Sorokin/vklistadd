import { h } from "preact";
import { useCallback } from "preact/hooks";
import { CheckboxRow } from "@components/vk/CheckboxRow";
import { IList } from "@vk/api/lists";
import { useForceUpdate } from "@utils/hooks";

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
		<CheckboxRow
			checked={listSelected}
			text={list.name}
			onChange={onChange}
			disabled={disabled}
		/>
	);
}
