import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { getFullContext } from "@vk/scrapers";
import { TargetContext } from "@components/contexts/TargetContext";
import { ListLoader } from "@components/lists/ListLoader";
import { BoxContext } from "@components/contexts/BoxContext";
import { TargetInfo } from "./TargetInfo";
import { TargetPrivateWarning } from "./TargetPrivateWarning";

/**
 * @return Элемент содержимого бокса
 */
export function BoxContent() {
	const { context, invoker } = useContext(BoxContext)!;

	const target = useMemo(
		() => getFullContext(invoker),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[context, invoker],
	);

	return (
		<TargetContext.Provider value={target}>
			<TargetInfo />
			<ListLoader />
			<TargetPrivateWarning />
		</TargetContext.Provider>
	);
}
