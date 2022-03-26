import { c, toClassName } from "@utils/fashion";
import { h } from "@external/preact";

type IntrinsicElements = import("preact").JSX.IntrinsicElements;

const linkButtonClass = toClassName("linkButton", {
  background: "none",
  border: "none",
  font: "inherit",
  color: "#2a5885",
  cursor: "pointer",
  padding: "inherit",

  "&:hover, &:focus": { textDecoration: "underline" },
});

/**
 * @param props Обычные свойства кнопки
 * @return Кнопку стилизованную под ссылку
 */
export function LinkButton(props: IntrinsicElements["button"]) {
  const { className } = props;

  return <button {...props} className={c(linkButtonClass, true, className)} />;
}
