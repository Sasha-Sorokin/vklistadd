import { useTarget, useTranslation } from "@utils/hooks";
import { h } from "preact";
import { ErrorBlock } from "@components/vk/ErrorBlock";
import { SupportedModule } from "@vk/scrapers";
import { c } from "@utils/fashion";
import { MARGIN_RESET, ERROR_MULTILINE } from "@common/css";

/**
 * @returns Блок с предупреждением о том, что приватности текущего объекта
 */
export function TargetPrivateWarning() {
	const translation = useTranslation("privateWarning");
	const target = useTarget();

	if (target == null || target.type == null) return null;

	const { isPrivate, type, isFollowed } = target;

	if (isPrivate == null || !isPrivate) return null;

	const text = (() => {
		switch (type) {
			case SupportedModule.Group: {
				return translation.group[Number(isFollowed)];
			}

			case SupportedModule.Profile: {
				return translation.profile;
			}

			default: return null;
		}
	})();

	if (text == null) return null;

	return (
		<ErrorBlock
			className={c(MARGIN_RESET, ERROR_MULTILINE)}
			style={{ marginTop: "10px" }}
			children={text}
		/>
	);
}
