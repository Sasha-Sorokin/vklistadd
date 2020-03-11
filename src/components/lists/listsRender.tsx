import { h } from "preact";
import { IList } from "@vk/api/lists";
import { toClassName } from "@utils/fashion";
import { useTranslation } from "@utils/hooks";
import { ListRow } from "./listRow";

/**
 * Представляет собой опции для списка
 */
export interface IListsRenderProps {
	/**
	 * Массив списков для которых создаются флажки
	 */
	lists: IList[];

	/**
	 * Каждый флажок в элементе должен быть отключён
	 */
	disabled?: boolean;
}

const GRAY_NOTICE = toClassName("grayNotice", { color: "#656565" });

/**
 * @returns Компонент, генерирующий флажки для каждого переданного списка
 */
export function ListsRender({ lists, disabled }: IListsRenderProps) {
	const { empty } = useTranslation("lists");

	if (lists.length === 0) {
		return <div className={GRAY_NOTICE}>{empty}</div>;
	}

	const rows = lists.map((_) => <ListRow list={_} disabled={disabled} />);

	return <div>{rows}</div>;
}
