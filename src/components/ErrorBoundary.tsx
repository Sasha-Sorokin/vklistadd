import { h, ComponentChild, VNode, Fragment } from "preact";
import { getVKTranslation } from "@utils/i18n";
import { log } from "@utils/debug";
import { useErrorBoundary } from "preact/hooks";
import { c } from "@utils/fashion";
import { MARGIN_RESET, ERROR_MULTILINE } from "@common/css";
import { ErrorBlock } from "./vk/ErrorBlock";

const TAG = "!!";
const LINK_PLACEHOLDER = `{${Math.random()}`;

/**
 * Обрабатывает текст ошибки и возвращает его в параграфах
 *
 * @param text Текст ошибки в текущей локализации
 * @returns Дочернее содержимое контейнера ошибки
 */
function wrapText(text: string) {
	let link: ComponentChild;

	{
		const lPos = text.indexOf(TAG) + TAG.length;

		const linkText = text.slice(lPos, text.indexOf(TAG, lPos));

		link = <a
			href="__report_link__"
			target="_blank"
			rel="noreferrer"
			children={linkText}
		/>;

		text = text.replace(`${TAG}${linkText}${TAG}`, LINK_PLACEHOLDER);
	}

	const chunks = text.split("\n");

	let first = true;

	const result: ComponentChild[] = [];

	for (const chunk of chunks) {
		if (first) first = false;
		else result.push(<br />);

		if (chunk === "") continue;

		if (chunk.includes(LINK_PLACEHOLDER)) {
			const [before, after] = chunk.split(LINK_PLACEHOLDER);

			result.push(before, link, after);

			continue;
		}

		result.push(<label>{chunk}</label>);
	}

	return result;
}

/**
 * Свойства компонента обработки ошибочного поведения
 */
export interface IErrorBoundaryProps {
	/**
	 * Дочерние компоненты под эгидой обработчика ошибок
	 */
	children: VNode<unknown>;
}

/**
 * @returns Компонент, который при ошибочном поведении одного из дочерних
 * компонентов перестаёт отрисовывать дерево дальше и вместо него отображает
 * ошибку
 */
export function ErrorBoundary({ children }: IErrorBoundaryProps) {
	// Из-за ошибки в типах Preact, мы не можем использовать обработчик
	// с параметром ошибки: https://github.com/preactjs/preact/pull/2397.
	// Чтобы обойти это, объявляем наш обработчик как never
	const [error] = useErrorBoundary(((err: Error): void => {
		log(
			"error", "%cError boundary caught an error%c",
			"font-weight: bold;", "",
			err,
		);
	}) as never);

	const { errorBoundary: { text } } = getVKTranslation();

	if (error != null) {
		return (
			<ErrorBlock
				className={c(MARGIN_RESET, ERROR_MULTILINE)}
				children={wrapText(text)}
			/>
		);
	}

	return <Fragment>{children}</Fragment>;
}
