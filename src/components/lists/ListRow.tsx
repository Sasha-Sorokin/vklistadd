import { CheckboxRow } from "@components/vk/CheckboxRow";
import type { IList } from "@vk/api/lists";
import { useForceUpdate } from "@utils/hooks";
import { toClassName } from "@utils/fashion";
import { useCallback } from "@external/preact/hooks";
import { h } from "@external/preact";
import { EditListButton, editButtonClass } from "./EditListButton";

/**
 * Представляет собой свойства элемента списка
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

const listRowClass = toClassName("listRow", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "start",

  [`&:hover .${editButtonClass}`]: {
    opacity: 1,
  },
});

/**
 * @param props Свойства элемента списка
 * @return Флажок для определённого списка
 */
export function ListRow(props: IListRowProps) {
  const { list, disabled } = props;
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
    <li className={listRowClass}>
      <CheckboxRow
        checked={listSelected}
        text={list.name}
        onChange={onChange}
        disabled={disabled}
        id={`list${list.id}`}
      />

      <EditListButton list={list} />
    </li>
  );
}
