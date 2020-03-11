import { useBoxContexts, useTranslation } from "@utils/hooks";
import { h, Fragment } from "preact";
import { IModuleContext } from "@common/types";
import { SupportedModule } from "@vk/scrapers";

/**
 * @returns Текст, соответствующий статусу подписки
 */
export function FollowText() {
	const [detail, target] = useBoxContexts();
	const translation = useTranslation("followStatus");

	if (detail == null || target == null) return <Fragment />;

	const { invoker } = detail;

	const context = detail.context as IModuleContext;

	const { isFollowed, isOwn } = target;

	if (isOwn != null && isOwn) {
		return <Fragment>{translation.context.own}</Fragment>;
	}

	const select = isFollowed == null
		? null
		: Number(isFollowed);

	const text = select != null
		? (() => {
			const { context: translations } = translation;

			const reference = invoker != null
				? invoker.subType
				: context.module;

			switch (reference) {
				case SupportedModule.Group: {
					return translations.group;
				}

				case SupportedModule.Public: {
					return translations.public;
				}

				case SupportedModule.Profile: {
					return translations.profile;
				}

				default: return null;
			}
		})()?.[select]
		: translation.unknown;

	return <Fragment>{text}</Fragment>;
}
