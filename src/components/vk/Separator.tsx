import { h } from "preact";
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

const STYLE = toStyleCombiner(
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
		<div className={STYLE("separator", "noMargin", noMargin ?? false)} />
	);
}
