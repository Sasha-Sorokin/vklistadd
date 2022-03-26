import type { IList } from "@vk/api/lists";
import { toClassName } from "@utils/fashion";
import { useTranslation } from "@utils/hooks";
import { h } from "@external/preact";
import { ListRow } from "./ListRow";

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

const grayNotice = toClassName("grayNotice", { color: "#656565" });

const listsListClass = toClassName("listsList", {
  listStyle: "none",
  padding: 0,
  margin: 0,
});

/**
 * @param props Свойства компонента рендера списка
 * @return Компонент, генерирующий флажки для каждого переданного списка
 */
export function ListsRender(props: IListsRenderProps) {
  const { lists, disabled } = props;
  const { empty } = useTranslation("lists");

  if (lists.length === 0) {
    return <div className={grayNotice}>{empty}</div>;
  }

  return (
    <ul className={listsListClass}>
      {lists.map((list) => (
        <ListRow list={list} disabled={disabled} key={list.id} />
      ))}
    </ul>
  );
}
