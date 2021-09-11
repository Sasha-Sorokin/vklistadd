import { h } from "@external/preact";
import { useMemo } from "@external/preact/hooks";
import { Tooltip } from "./Tooltip";

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
const hintTooltipShift = [22, 10] as const;
const hintTooltipSlide = 10;

/**
 * @param props Параметры элемента подсказки
 * @return Элемент подсказки
 */
export function Hint(props: IHintProps) {
  const { style, className, hintOptions, text } = props;

  const tooltipOptions = useMemo(
    () => ({
      text,
      dir: "auto" as VK.TooltipDirection,
      center: true,
      className,
      shift: hintTooltipShift,
      slide: hintTooltipSlide,
      ...hintOptions,
    }),
    [className, hintOptions, text],
  );

  return (
    <Tooltip opts={tooltipOptions}>
      <span className="hint_icon" style={style} tabIndex={0} />
    </Tooltip>
  );
}
