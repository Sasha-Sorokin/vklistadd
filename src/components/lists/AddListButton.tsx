import { usePreventedCallback } from "@utils/hooks";
import { TranslationContext } from "@components/contexts/TranslationContext";
import { toStyleCombiner } from "@utils/fashion";
import { lockCombo } from "@common/css";
import { Title } from "@components/vk/Tooltip";
import { LinkButton } from "@components/vk/LinkButton";
import { useContext } from "@external/preact/hooks";
import { h } from "@external/preact";

const plusIconUrl = "/images/icons/filter_add.png";

const styleCombiner = toStyleCombiner(
  {
    button: {
      marginTop: "10px",
      width: "max-content",
      lineHeight: "17px",
      cursor: "pointer",
      display: "block",

      "&::before": {
        content: "''",
        background: `url("${plusIconUrl}") 1px 3px no-repeat`,
        width: "15px",
        height: "15px",
        float: "left",
        margin: "0 7px 0 0",
      },
    },
  },
  {
    locked: lockCombo,
  },
);

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const defaultTooltipOffsets = [-10, 8] as const;

const centerTooltip = { center: true };

/**
 * Представляет собой свойства ссылки
 */
export interface IAddListButtonProps {
  /**
   * Ссылка отключена и не отзывается на клики
   */
  disabled?: boolean;

  /**
   * Обработчик нажатия на ссылку
   */
  onClick?(this: void): void;
}

/**
 * @param props Свойства ссылки
 * @return Ссылка на добавление нового списка
 */
export function AddListButton(props: IAddListButtonProps) {
  const { onClick } = props;
  const disabled = props.disabled ?? false;

  const onLinkClick = usePreventedCallback(disabled ? null : onClick);

  const { addListButton: translation } = useContext(TranslationContext);
  return (
    <Title
      text={translation.tooltip}
      shift={defaultTooltipOffsets}
      opts={centerTooltip}
    >
      <LinkButton
        onClick={onLinkClick}
        className={styleCombiner("button", "locked", disabled)}
        children={translation.text}
      />
    </Title>
  );
}
