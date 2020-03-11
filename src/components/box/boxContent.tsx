import { h } from "preact";
import { useMemo, useContext } from "preact/hooks";
import { getFullContext } from "@vk/scrapers";
import { TargetContext } from "@components/contexts/targetContext";
import { ListLoader } from "@components/lists/listLoader";
import { BoxContext } from "@components/contexts/boxContext";
import { TargetInfo } from "./targetInfo";
import { TargetPrivateWarning } from "./targetPrivateWarning";

/**
 * @returns Элемент содержимого бокса
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
