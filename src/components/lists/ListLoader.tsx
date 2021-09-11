import { getLists } from "@vk/api/lists";
import { ProgressIndicator, dotsSize } from "@components/vk/ProgressIndicator";
import { ErrorBlock } from "@components/vk/ErrorBlock";
import { Separator } from "@components/vk/Separator";
import { editList } from "@vk/helpers/newsfeed";
import { c } from "@utils/fashion";
import { getWindow } from "@utils/window";
import { marginReset, errorMultiple } from "@common/css";
import { useBoxContexts, useTranslations } from "@utils/hooks";
import { useCallback, useEffect } from "@external/preact/hooks";
import { Fragment, h } from "@external/preact";
import { LabelColor } from "@/box/controlsLabel";
import { useLoaderReducer } from "./reducers/reducer";
import { ListsRender } from "./ListsRender";
import { AddListButton } from "./AddListButton";
import { ActionLabel } from "./ActionLabel";
import { targetChange, loadFailure, listsLoaded } from "./reducers/actions";
import { LoadingState } from "./reducers/types";

/**
 * Представляет собой свойства загрузкчика
 */
export interface IListLoaderProps {
  /**
   * Компонент отключён
   */
  disabled?: boolean;
}

const progressIndicatorSize = 6; // px / dot

/**
 * @param props Свойства загрузчика
 * @return Загрузчик списка для текущего контекста
 */
export function ListLoader(props: IListLoaderProps) {
  const { disabled } = props;
  const [$detail, target] = useBoxContexts();
  const detail = $detail!;

  const translation = useTranslations();
  const [state, dispatch] = useLoaderReducer();

  const { invoker } = detail;

  useEffect(() => {
    dispatch(targetChange(target, invoker));
  }, [dispatch, target, invoker]);

  useEffect(() => {
    const { loadingStatus, lastTarget: target } = state;

    if (loadingStatus !== LoadingState.Reset) return;

    if (target == null || target.id == null) {
      dispatch(loadFailure());

      return;
    }

    getLists(target.id, true)
      .then((lists) => {
        dispatch(listsLoaded(lists));

        detail.onListsLoad(lists);
      })
      .catch((_err) => {
        dispatch(loadFailure());

        detail.onListsLoadFail?.();
      });
  }, [dispatch, detail, state]);

  const onAddList = useCallback(() => {
    if (target == null) return;

    const result = editList(-1, target, translation);

    if (result) return;

    detail.displayLabel(getWindow().lang.global_error_occured, LabelColor.Red);
  }, [target, detail, translation]);

  if (target == null) return null;

  const { loadingStatus, lists } = state;

  if (lists == null) {
    if (loadingStatus === LoadingState.Failed) {
      const { loadFailed } = translation.listLoader;

      return (
        <ErrorBlock
          className={c(marginReset, errorMultiple)}
          children={loadFailed}
        />
      );
    }

    return (
      <ProgressIndicator
        centered
        className={dotsSize(progressIndicatorSize)}
        style={"padding: 10px 0;"}
      />
    );
  }

  return (
    <Fragment>
      <ActionLabel />
      <ListsRender disabled={disabled} lists={lists.lists} />
      <Separator noMargin />
      <AddListButton disabled={disabled} onClick={onAddList} />
    </Fragment>
  );
}
