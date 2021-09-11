import { getWindow } from "@utils/window";
import { getVKTranslation } from "@utils/i18n";
import { BoxContent } from "@components/box/BoxContent";
import { ErrorBoundary } from "@components/ErrorBoundary";
import { BoxContext } from "@components/contexts/BoxContext";
import type { ITreating } from "@vk/scrapers";
import { TranslationContext } from "@components/contexts/TranslationContext";
import type { UnknownObj } from "@common/types";
import { useMemo } from "@external/preact/hooks";
import { h, render } from "@external/preact";
import type { IBoxDetail } from "./types";
import { initializeControls } from "./controls";
import { showControlsLabel } from "./controlsLabel";

let contentWrap: HTMLDivElement | null = null;

/**
 * Представляет собой свойства бокса
 */
interface IBoxProps {
  /**
   * Информация для контекста бокса
   */
  detail: IBoxDetail;
}

/**
 * @param props Информация для контекста бокса
 * @return Содержимое бокса
 */
function Box(props: IBoxProps) {
  const { detail } = props;
  const translation = useMemo(getVKTranslation, []);

  return (
    <ErrorBoundary>
      <TranslationContext.Provider value={translation}>
        <BoxContext.Provider value={detail}>
          <BoxContent />
        </BoxContext.Provider>
      </TranslationContext.Provider>
    </ErrorBoundary>
  );
}

/**
 * Добавляет обёртку в бокс и отрисовывает содержимое в ней
 *
 * @param box Бокс, в котором нужно отрисовать содержимое
 * @param detail Информация для контекста бокса
 */
function addContentWrap(box: VK.MessageBox, detail: IBoxDetail) {
  if (contentWrap == null) {
    contentWrap = document.createElement("div");
  }

  box.content(contentWrap);

  render(<Box detail={detail} />, contentWrap);
}

type CachedBox = [VK.MessageBox, ReturnType<typeof initializeControls>];

let currentBox: CachedBox | undefined;

/**
 * @return Ранее или ново- созданный бокс
 */
function getBox() {
  let box = currentBox;

  if (box == null) {
    const { MessageBox } = getWindow();

    const newBox = new MessageBox({
      selfDestruct: false,
      title: getVKTranslation().box.title,
    });

    const controlsLeftovers = initializeControls(newBox);

    box = [newBox, controlsLeftovers];

    currentBox = box;
  }

  return box;
}

type DetailBasisProps =
  | "onListsLoad"
  | "onListsLoadFail"
  | "handleSave"
  | "displayLabel";

let detailBasis: Pick<IBoxDetail, DetailBasisProps> | null = null;

let detail: IBoxDetail | null = null;

/**
 * Отображает бокс для изменения списков
 *
 * @param invoker Информация об альтернативном элементе
 */
export function showBox(invoker?: Readonly<ITreating>) {
  const [box, [setLists, resetLists, onSave]] = getBox();

  box.show();

  const ctx = getWindow().cur as UnknownObj;

  if (detailBasis == null) {
    detailBasis = {
      onListsLoad: setLists,
      onListsLoadFail: resetLists,
      handleSave: onSave,
      displayLabel: (text, color) => showControlsLabel(box, text, color),
    };
  }

  const isDetailUpdated =
    detail == null || detail.context !== ctx || detail.invoker !== invoker;

  if (isDetailUpdated) {
    detail = {
      ...detailBasis,
      ...detail,
      context: ctx,
      invoker,
    };
  }

  addContentWrap(box, detail!);
}
