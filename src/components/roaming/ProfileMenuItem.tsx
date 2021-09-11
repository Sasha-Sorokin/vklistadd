import { getVKTranslation } from "@utils/i18n";
import { asRoaming } from "@utils/freeComponents";
import { h } from "@external/preact";
import { useCallback } from "@external/preact/hooks";
import { showBox } from "@/box";
import { iconNewsfeed } from "@/assets";

const iconContents = iconNewsfeed.source;

/**
 * @return Элемент меню для встраивания на страницах пользователей
 */
function ProfileMenuItem() {
  const { actionButton: translation } = getVKTranslation();

  const onClick = useCallback(() => showBox(undefined), []);

  return (
    <a className="PageActionCell" tabIndex={0} role="link" onClick={onClick}>
      <div
        className="PageActionCell__icon"
        // eslint-disable-next-line
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line
          __html: iconContents,
        }}
      />
      <span className="PageActionCell__label">{translation.text}</span>
    </a>
  );
}

/**
 * @return Функция для встраивания элемента меню
 */
export function getRoaming() {
  return asRoaming(<ProfileMenuItem />);
}
