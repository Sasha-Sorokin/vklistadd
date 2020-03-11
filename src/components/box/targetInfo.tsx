import { h, Fragment } from "preact";
import { InfoBlock } from "@components/vk/infoBlock";
import { FollowText } from "@components/box/followText";
import { Hint } from "@components/vk/hint";
import { toClassName } from "@utils/fashion";
import { useTarget, useTranslation } from "@utils/hooks";
import { NotificationsToggle } from "./notificationsToggle";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const TOOLTIP_SHIFT = [-8, 10] as const;

const TOOLTIP_CLASS = toClassName("tooltip", { width: "250px" });

/**
 * @returns Элемент подсказки про неважность подписки
 */
function FollowHint() {
	const { hint } = useTranslation("followStatus");

	return (
		<Hint
			text={hint}
			className={TOOLTIP_CLASS}
			hintOptions={{
				shift: TOOLTIP_SHIFT,
				center: true,
			}}
			style={{
				margin: "0 20px 0 5px",
			}}
		/>
	);
}

/**
 * @returns Фргамент для блока информации об объекте
 */
function InfoFragment() {
	const notificationsToggle = <NotificationsToggle />;

	return (
		<Fragment>
			<FollowText /><FollowHint />
			{notificationsToggle != null ? <br /> : ""}
			{notificationsToggle}
		</Fragment>
	);
}

/**
 * @returns Блок информации об объекте в текущем контексте
 */
export function TargetInfo() {
	const target = useTarget();

	if (target == null) return null;

	return (
		<InfoBlock
			avatarUrl={target.icon}
			displayName={target.name ?? ""}
			infoChildren={<InfoFragment />}
			link={target.link ?? ""}
		/>
	);
}
