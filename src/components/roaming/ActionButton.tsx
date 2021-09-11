import { MountFunction, asRoaming } from "@utils/freeComponents";
import { getVKTranslation } from "@utils/i18n";
import { toStyleCombiner } from "@utils/fashion";
import { useCallback } from "@external/preact/hooks";
import { h } from "@external/preact";
import { iconGear } from "@/assets";
import { showBox } from "@/box";

const actionButtonAccent = "#3f3f3f";

const styleCombiner = toStyleCombiner(
  {
    actionMenuItem: {
      cursor: "pointer",
      color: `${actionButtonAccent} !important`,

      background: "none",
      border: "none",
      textAlign: "left",
      font: "inherit",

      width: "100%",

      "&::before": {
        "--icon": iconGear.url,

        background: `${actionButtonAccent} !important`,
        mask: "var(--icon) !important",
        "-webkit-mask": "var(--icon) !important",
        opacity: "1 !important",
      },

      "&:hover": {
        textDecoration: "underline !important",
      },
    },
  },
  {
    vkActionMenuItem: "page_actions_item",
  },
);

const buttonClassName = styleCombiner("vkActionMenuItem", "actionMenuItem");

/**
 * @return Кнопка для правостороннего меню в группах и пабликах
 */
function ActionButton() {
  const onClick = useCallback(() => showBox(undefined), []);

  return (
    // FIXME: please bind locale to inner [locale] "button" property
    // FIXME: add call to toggle box
    <button className={buttonClassName} onClick={onClick}>
      {getVKTranslation().actionButton.text}
    </button>
  );
}

let mountFunction: MountFunction<undefined> | null = null;

/**
 * @return Функция для встраивания кнопки
 */
export function getRoaming() {
  if (mountFunction == null) {
    mountFunction = asRoaming(() => <ActionButton />);
  }

  return mountFunction;
}
