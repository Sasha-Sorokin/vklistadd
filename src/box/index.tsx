import { getWindow } from "@utils/window";
import { getVKTranslation } from "@utils/i18n";
import { render, h } from "preact";
import { BoxContent } from "@components/box/boxContent";
import { ErrorBoundary } from "@components/errorBoundary";
import { BoxContext } from "@components/contexts/boxContext";
import { ITreating } from "@vk/scrapers";
import { TranslationContext } from "@components/contexts/translationContext";
import { useMemo } from "preact/hooks";
import { IBoxDetail } from "./types";
import { initializeControls } from "./controls";
import { showControlsLabel } from "./controlsLabel";

let contentWrap: HTMLDivElement;

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
 * @returns Содержимое бокса
 */
function Box({ detail }: IBoxProps) {
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
 * @returns Ранее или ново- созданный бокс
 */
function getBox() {
	let box = currentBox;

	if (box == null) {
		const { MessageBox } = getWindow();

		const newBox = new MessageBox({
			selfDestruct: false,
			title: getVKTranslation().box.title,
			white: true,
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

	const ctx = getWindow().cur as object;

	if (detailBasis == null) {
		detailBasis = {
			onListsLoad: setLists,
			onListsLoadFail: resetLists,
			handleSave: onSave,
			displayLabel: (text, color) => showControlsLabel(box, text, color),
		};
	}

	const isDetailUpdated = detail == null
		|| detail.context !== ctx
		|| detail.invoker !== invoker;

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
