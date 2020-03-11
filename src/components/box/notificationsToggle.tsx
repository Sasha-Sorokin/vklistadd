import { h, Fragment } from "preact";
import { useTarget, useTranslation } from "@utils/hooks";
import { useEffect } from "preact/hooks";
import { ProgressIndicator, dotsSize } from "@components/vk/progressIndicator";
import { c, toClassName } from "@utils/fashion";

const INDICATOR_STYLES = toClassName("inline", {
	display: "inline-block",
	marginLeft: "3px",
	"& .pr": {
		display: "inline-block",
		position: "relative",
		top: "-2px",
	},
});

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const INDICATOR = c(dotsSize(4), INDICATOR_STYLES);

/**
 * @returns Переключатель уведомлений
 */
export function NotificationsToggle() {
	const translation = useTranslation("notificationsStatus");
	const { useNotifications } = useTarget()!;

	const notifications = useNotifications();

	const { disconnect } = notifications;

	useEffect(() => disconnect, [disconnect]);

	if (notifications.isAvailable === "no") return null;

	const { isToggling, toggle } = notifications;

	const progressIndicator = isToggling
		? <Fragment><ProgressIndicator className={INDICATOR} /></Fragment>
		: null;

	return (
		<a onClick={toggle}>
			{translation[Number(notifications.isToggled)]}
			{progressIndicator}
		</a>
	);
}
