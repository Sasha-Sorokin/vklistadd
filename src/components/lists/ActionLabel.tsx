import { h } from "preact";
import { TreatingKind, SupportedModule } from "@vk/scrapers";
import { DEFAULT_MARGIN } from "@common/css";
import { IModuleContext } from "@common/types";
import { useBoxDetail, useTranslation } from "@utils/hooks";

type ContextType = keyof ITranslation["actionLabel"]["context"];

/**
 * @return Надпись, призывающая к действию — добавлению объекта в списки
 */
export function ActionLabel() {
	const detail = useBoxDetail();
	const translation = useTranslation("actionLabel");

	if (detail == null) return null;

	const byContext = (context: ContextType) => {
		const value = translation.context[context];

		return translation.template.replace("{}", value);
	};

	const { invoker, context } = detail;

	const reference =
		invoker != null ? invoker.subType : (context as IModuleContext).module;

	const text = byContext(
		((): ContextType => {
			switch (reference) {
				case SupportedModule.Group:
					return "group";
				case SupportedModule.Profile:
					return "profile";
				case SupportedModule.Public:
					return "public";

				default: {
					switch (invoker?.kind) {
						case TreatingKind.Bookmark:
							return "bookmark";

						default:
							break;
					}

					return "other";
				}
			}
		})(),
	);

	return <div className={DEFAULT_MARGIN}>{text}</div>;
}
