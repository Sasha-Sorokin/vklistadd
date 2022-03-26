import { h } from "@external/preact";
import { c } from "@utils/fashion";

type DivProps = import("preact").JSX.HTMLAttributes<HTMLDivElement>;

/**
 * @param props Все свойства, которые можно применить к DIV элементу
 * @return Устрашающий пользователя красный блок с воскл. знаком
 */
export function ErrorBlock(props: DivProps) {
  const className = c("error", props.className);

  return <div {...props} className={className} />;
}
