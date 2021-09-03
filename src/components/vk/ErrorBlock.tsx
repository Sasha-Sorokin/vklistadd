import { h } from "preact";
import { c } from "@utils/fashion";

type DivProps = h.JSX.HTMLAttributes<HTMLDivElement>;

/**
 * @param props Все свойства, которые можно применить к DIV элементу
 * @return Устрашающий пользователя красный блок с воскл. знаком
 */
export function ErrorBlock(props: DivProps) {
	const className = c("error", props.className);

	return <div {...props} className={className} />;
}
