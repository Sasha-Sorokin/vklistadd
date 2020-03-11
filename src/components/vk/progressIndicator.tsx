import { h } from "preact";
import { useRef, useEffect, useState } from "preact/hooks";
import { getWindow } from "@utils/window";
import { c, toClassName } from "@utils/fashion";
import { Style } from "@common/types";

const CENTERED_CLASS = toClassName("centeredClass", {
	width: "max-content",
	margin: "0 auto",
});

const NUMBER_OF_SPACES_AND_TOTALLY_NOT_A_MAGIC_NUMBER = 2;

/**
 * Так как Goober будет бесконечно создавать `<style>` элементы каждый раз
 * при вызове функции `css`, имеет смысл сохранять названия классов, чтобы
 * не плодить бесконечность одинаковых стилей. Так как стили остаются в шапке
 * страницы «навечно», не имеет смысла мудрить и «выгружать» что-либо из этой
 * карты.
 */
const SIZE_CLASSES = new Map<number, string>();

/**
 * Генерирует стиль для изменения размера точек в индикаторе прогресса и
 * возвращает название класса для применения к индикатору прогресса или
 * любому элементу вообще, который содержит индикаторы прогресса
 *
 * @param dotSize Размер одной точки
 * @returns Название класса для применения к компоненту индикатора или
 * любому элементу, содержащему в дочерних классах индикатор прогресса
 */
export function dotsSize(dotSize: number) {
	let className = SIZE_CLASSES.get(dotSize);

	if (className != null) return className;

	const spaceSize = dotSize / NUMBER_OF_SPACES_AND_TOTALLY_NOT_A_MAGIC_NUMBER;

	className = toClassName(`dotSize${dotSize}`, {
		"& .pr .pr_bt": {
			width: `${dotSize}px`,
			height: `${dotSize}px`,
			marginRight: `${spaceSize}px`,

			"&:first": {
				marginLeft: `${spaceSize}px`,
			},
		},
	});

	SIZE_CLASSES.set(dotSize, className);

	return className;
}


/**
 * Представляет собой опции индикатора прогресса
 */
export interface IProgressIndicatorProps {
	/**
	 * Булевое значение, если индикатор должен отображаться по центру
	 * родительского элемента (если это возможно; применяет `margin: 0 auto`)
	 */
	centered?: boolean;

	/**
	 * Стили, применимые к корневому элементу индикатора
	 */
	style?: Style;

	/**
	 * Название класса, применяемое к корневому элементу индикатора
	 *
	 * Элемент индикатора имеет класс `pr`, когда как каждая точка в нём
	 * имеет класс `pr_bt`. Это можно использовать для вычисления размера
	 * индикатора
	 */
	className?: string;
}

/**
 * Компонент индикации прогресса
 *
 * @param props Настройки индикатора
 * @returns DIV элемент с тремя точками внутри
 */
export function ProgressIndicator(props: IProgressIndicatorProps) {
	const { centered, className, style } = props;
	const progressHolder = useRef<HTMLDivElement>();
	const [isMounted, setMounted] = useState(false);

	useEffect(() => {
		const holder = progressHolder.current;

		if (holder == null || isMounted) return;

		getWindow().showProgress(holder);

		setMounted(true);
	}, [progressHolder, isMounted]);

	return (
		<div
			ref={progressHolder}
			className={c(className, CENTERED_CLASS, centered ?? false)}
			style={style}
		/>
	);
}
