import { h, createRef } from "preact";
import { useCallback } from "preact/hooks";
import { getWindow } from "@utils/window";
// import { TooltipParent } from "@common/types";

/**
 * Представляет собой опции элемента подсказки
 */
export interface IHintProps {
	/**
	 * Перечисление классов для **всплывающей подсказки**
	 */
	className?: string;

	/**
	 * Стиль элемента подсказки
	 */
	style?: string | { [property: string]: string };

	/**
	 * Индивидуальные настройки подсказки
	 */
	hintOptions?: Partial<VK.ITooltipOptions<HTMLSpanElement>>;

	/**
	 * Текст всплывающей подсказки при наведении
	 */
	text: string;
}

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const HINT_TOOLTIP_SHIFT = [22, 10] as const;
const HINT_TOOLTIP_SLIDE = 10;

/**
 * @param props Параметры элемента подсказки
 * @returns Элемент подсказки
 */
export function Hint({ style, className, hintOptions, text }: IHintProps) {
	const hintRef = createRef<HTMLSpanElement>();

	const showTooltip = useCallback(() => {
		const { current } = hintRef;

		if (current == null) return;

		getWindow().showTooltip(current, {
			text,
			dir: VK.TooltipDirection.Auto,
			center: true,
			className,
			shift: HINT_TOOLTIP_SHIFT,
			slide: HINT_TOOLTIP_SLIDE,
			...hintOptions,
		});
	}, [hintOptions, className, hintRef, text]);

	return (
		<span
			className="hint_icon"
			style={style}
			ref={hintRef}
			onMouseOver={showTooltip}
		/>
	);
}
