import { useTarget, useTranslation } from "@utils/hooks";
import { ProgressIndicator, dotsSize } from "@components/vk/ProgressIndicator";
import { c, toClassName } from "@utils/fashion";
import { LinkButton } from "@components/vk/LinkButton";
import { useEffect } from "@external/preact/hooks";
import { Fragment, h } from "@external/preact";

const indicatorStyles = toClassName("inline", {
  display: "inline-block",
  marginLeft: "3px",
  "& .pr": {
    display: "inline-block",
    position: "relative",
    top: "-2px",
  },
});

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const indicatorClass = c(dotsSize(4), indicatorStyles);

/**
 * @return Переключатель уведомлений
 */
export function NotificationsToggle() {
  const translation = useTranslation("notificationsStatus");
  const { useNotifications } = useTarget()!;

  const notifications = useNotifications();

  const { disconnect } = notifications;

  useEffect(() => disconnect, [disconnect]);

  if (notifications.isAvailable === "no") return null;

  const { isToggling, toggle } = notifications;

  const progressIndicator = isToggling ? (
    <Fragment>
      <ProgressIndicator className={indicatorClass} />
    </Fragment>
  ) : null;

  return (
    <LinkButton onClick={toggle}>
      {translation[Number(notifications.isToggled)]}
      {progressIndicator}
    </LinkButton>
  );
}
