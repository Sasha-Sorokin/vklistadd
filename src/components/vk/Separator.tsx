import { h } from "@external/preact";
import { toStyleCombiner } from "@utils/fashion";

/**
 * Представляет собой опции разделителя
 */
export interface ISeparatorProps {
  /**
   * Следует ли сбросить отступы по сторонам
   */
  noMargin?: boolean;
}

const styleCombiner = toStyleCombiner(
  {
    noMargin: {
      margin: "0",
    },
  },
  {
    separator: "top_profile_sep",
  },
);

/**
 * @param props Свойства разделителя
 * @return Разделитель
 */
export function Separator(props: ISeparatorProps) {
  const { noMargin } = props;

  return (
    <div
      className={styleCombiner("separator", "noMargin", noMargin ?? false)}
    />
  );
}
