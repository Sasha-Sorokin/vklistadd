import { genericCameraIcon } from "@common/consts";
import { toStyleCombiner } from "@utils/fashion";
import { clearFix, pointerLocked } from "@common/css";
import { useTranslation } from "@utils/hooks";
import { h } from "@external/preact";

type ComponentChild = import("preact").ComponentChild;

/**
 * Представляет собой опции блока информации об объекте
 */
export interface IInfoBlockProps {
  /**
   * Ссылка на аватарку объекта
   */
  avatarUrl?: string | null;

  /**
   * Отображаемое название/имя объекта
   */
  displayName: string;

  /**
   * Ссылка на объект
   */
  link: string;

  /**
   * Элементы информации об объекте
   */
  infoChildren?: ComponentChild[] | ComponentChild;

  /**
   * Следует ли отключить действие ссылок
   */
  disabled?: boolean;
}

const S = toStyleCombiner(
  {
    infoBlock: {
      display: "block",
      marginBottom: "15px",
      lineHeight: "130%",
    },

    leftFloat: {
      float: "left",
    },

    targetInfo: {
      wordWrap: "break-word",
      padding: "2px 0 0 12px",
    },

    targetName: {
      marginBottom: "2px",
    },

    targetAvatar: {
      position: "relative",
      width: "42px",
      height: "42px",
      borderRadius: "100%",
      overflow: "hidden",
      objectFit: "cover",
    },

    infoText: {
      maxHeight: "48px",
      overflow: "visible",
    },
  },
  {
    locked: pointerLocked,
    clearfix: clearFix,
  },
);

const clickStub = (e: MouseEvent) => {
  e.preventDefault();

  return false;
};

/**
 * @param props Свойства блока
 * @return Блок информации о паблике, группе или пользователе
 */
export function InfoBlock(props: IInfoBlockProps) {
  const translation = useTranslation("infoBlock");

  const { displayName, link, infoChildren } = props;

  const disabled = props.disabled ?? false;

  const avatarUrl = props.avatarUrl ?? genericCameraIcon;

  const avatarAlt = translation.avatarAlt.replace("{}", displayName);

  const onClick = disabled ? clickStub : undefined;

  return (
    <div className={S("infoBlock", "clearfix")}>
      <a
        className={S("leftFloat", "locked", disabled)}
        href={link}
        onClick={onClick}
      >
        <img className={S("targetAvatar")} src={avatarUrl} alt={avatarAlt} />
      </a>
      <div className={S("leftFloat", "targetInfo")}>
        <div className={S("targetName")}>
          <a href={link} onClick={onClick}>
            {displayName}
          </a>
        </div>
        <div className={S("leftFloat", "infoText")}>{infoChildren}</div>
      </div>
    </div>
  );
}
