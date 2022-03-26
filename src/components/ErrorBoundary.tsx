import { getVKTranslation } from "@utils/i18n";
import { log } from "@utils/debug";
import { c } from "@utils/fashion";
import { marginReset, errorMultiple } from "@common/css";
// eslint-disable-next-line no-restricted-imports
import type { ComponentChild, VNode } from "preact";
import { useErrorBoundary, useCallback } from "@external/preact/hooks";
import { Fragment, h } from "@external/preact";
import { ErrorBlock } from "./vk/ErrorBlock";

const tagWrap = "!!";
const linkPlaceholder = `{${Math.random()}`;

/**
 * Обрабатывает текст ошибки и возвращает его в параграфах
 *
 * @param _text Текст ошибки в текущей локализации
 * @return Дочернее содержимое контейнера ошибки
 */
function wrapText(_text: string) {
  let text = _text;
  let link: ComponentChild;

  {
    const lPos = text.indexOf(tagWrap) + tagWrap.length;

    const linkText = text.slice(lPos, text.indexOf(tagWrap, lPos));

    link = (
      <a
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        href={GM?.info.script.supportURL ?? GM_info.script.supportURL ?? "#"}
        target="_blank"
        rel="noreferrer"
        children={linkText}
      />
    );

    text = text.replace(`${tagWrap}${linkText}${tagWrap}`, linkPlaceholder);
  }

  const chunks = text.split("\n");

  let first = true;

  const result: ComponentChild[] = [];

  for (const chunk of chunks) {
    if (first) first = false;
    else result.push(<br />);

    if (chunk === "") continue;

    if (chunk.includes(linkPlaceholder)) {
      const [before, after] = chunk.split(linkPlaceholder);

      result.push(before, link, after);

      continue;
    }

    result.push(<label>{chunk}</label>);
  }

  return result;
}

/**
 * Представляет собой свойства компонента обработки ошибочного поведения
 */
export interface IErrorBoundaryProps {
  /**
   * Дочерние компоненты под эгидой обработчика ошибок
   */
  children: VNode<unknown>;
}

/**
 * @param props Свойства компонента обработки ошибочного поведения
 * @return Компонент, который при ошибочном поведении одного из дочерних
 * компонентов перестаёт отрисовывать дерево дальше и вместо него отображает
 * ошибку
 */
export function ErrorBoundary(props: IErrorBoundaryProps) {
  const { children } = props;

  // Из-за ошибки в типах Preact, мы не можем использовать обработчик
  // с параметром ошибки: https://github.com/preactjs/preact/pull/2397.
  // Чтобы обойти это, объявляем наш обработчик как never
  const [error, reset] = useErrorBoundary(((err: Error): void => {
    log(
      "error",
      "%cError boundary caught an error%c",
      "font-weight: bold;",
      "",
      err,
    );
  }) as never);

  const retryOnClick = useCallback(() => reset(), [reset]);

  const {
    errorBoundary: { text, retry },
  } = getVKTranslation();

  if (error != null) {
    return (
      <Fragment>
        <ErrorBlock
          className={c(marginReset, errorMultiple)}
          children={wrapText(text)}
        />

        <button onClick={retryOnClick}>{retry}</button>
      </Fragment>
    );
  }

  return <Fragment>{children}</Fragment>;
}
