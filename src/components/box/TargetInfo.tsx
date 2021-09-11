import { InfoBlock } from "@components/vk/InfoBlock";
import { FollowText } from "@components/box/FollowText";
import { Hint } from "@components/vk/Hint";
import { toClassName } from "@utils/fashion";
import { useTarget, useTranslation } from "@utils/hooks";
import { Fragment, h } from "@external/preact";
import { NotificationsToggle } from "./NotificationsToggle";

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const tooltipShift = [-8, 10] as const;
const tooltipClass = toClassName("tooltip", { width: "250px" });

/**
 * @return Элемент подсказки про неважность подписки
 */
function FollowHint() {
  const { hint } = useTranslation("followStatus");

  return (
    <Hint
      text={hint}
      className={tooltipClass}
      hintOptions={{
        shift: tooltipShift,
        center: true,
      }}
      style={{
        margin: "0 20px 0 5px",
      }}
    />
  );
}

/**
 * @return Фргамент для блока информации об объекте
 */
function InfoFragment() {
  return (
    <Fragment>
      <FollowText />
      <FollowHint />
      <br />
      <NotificationsToggle />
    </Fragment>
  );
}

/**
 * @return Блок информации об объекте в текущем контексте
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
