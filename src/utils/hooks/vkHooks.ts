import { useState, useCallback, useEffect, useMemo } from "preact/hooks";
import { getWindow } from "@utils/window";

/**
 * Представляет собой объект подсказки с методом уничтожения
 *
 * Из-за необходимости объекта подсказки знать тип элемента и опций,
 * создаём тип, имеющий только необходимый нам метод — `destroy()`.
 */
interface ITooltipLike {
	/**
	 * Функция уничтожения подсказки
	 */
	destroy(): void;
}

/**
 * Создаёт функцию, которую можно использовать в качестве обработчика
 * события `onMouseOver` у элемента, для которого требуется отобразить
 * подсказку с переданными опциями
 *
 * Данный хук следует использовать в качестве замены стандартному вызову
 * `Window#showTooltip`, т.к. при уничтожении элемента, для которого
 * отображается подсказка, сама подсказка останется в дереве.
 *
 * Для часто пересоздаваемых элементов это может привести к большой утечке
 * памяти, ведь не только элемент, но и объект, хранящий уничтоженный
 * элемент, элемент подсказки, а также её опции никуда не девается (*уточ.*).
 *
 * @param opts Опции для подсказки
 * @return Функция-обработчик события `onMouseOver`
 */
export function $useTooltip(opts?: Partial<VK.ITooltipOptions<Element>>) {
	const [tooltipRef] = useState<{ current?: ITooltipLike }>({});

	const destroyTooltip = useCallback(() => {
		tooltipRef.current?.destroy();
	}, [tooltipRef]);

	const setTooltip = useCallback(
		(tt: ITooltipLike) => {
			destroyTooltip();

			tooltipRef.current = tt;
		},
		[destroyTooltip, tooltipRef],
	);

	useEffect(() => destroyTooltip, [destroyTooltip]);

	// Мы не убираем обработчик события init у подсказки в опциях,
	// поэтому нам нужно предусмотреть тот случай, когда обработчик
	// задан в переданных опциях, иначе мы перезапишем его и он не
	// будет работать.
	//
	// Для этого смотрим, задан ли обработчик и если так, то создаём
	// функцию, которая вызовет сначала его, а потом наш метод установки
	// подсказки. Если обработчика нет — вызываем установку напрямую.
	const tooltipOptions = useMemo(
		() => ({
			...opts,
			init:
				opts?.init != null
					? (tt: ITooltipLike) => {
							opts.init?.(tt as never);

							setTooltip(tt);
					  }
					: setTooltip,
		}),
		[opts, setTooltip],
	);

	return useCallback(
		(e: MouseEvent) => {
			getWindow().showTooltip(e.currentTarget as Element, tooltipOptions);
		},
		[tooltipOptions],
	);
}

/**
 * Создаёт функцию, которую можно использовать в качестве обработчика
 * события `onMouseOver` у элемента, для которого требуется отображать
 * переданное содержимое подсказки
 *
 * @see useTooltip За дополнительной информацией, почему следует использовать
 * этот хук в качестве замены прямого вызова {@link Window#showTitle}
 * @param titleContents Содержимое подсказки
 * @param shift Отступы подсказки
 * @param opts Опции для подсказки
 * @see Window#showTitle За дополнительной информацией о параметрах
 * @return Фукнция-обработчик события `onMouseOver`
 */
export function $useTitle(
	titleContents: string,
	shift?: VK.TooltipShift,
	opts?: Partial<VK.ITooltipOptions<Element>>,
) {
	// Этот код точно повторяет то, как работает showTitle.
	//
	// Если коротко: title это обычная подсказка с опцией black;
	// у функции showTitle есть несколько упрощающих аргументов.
	//
	// Чтобы не создавать каждый раз новый объект и приводить к
	// обнулению прошлого обработчика, используем useMemo
	const $opts = useMemo(
		() => ({
			text: titleContents,
			black: true,
			shift,
			...opts,
		}),
		[opts, shift, titleContents],
	);

	return $useTooltip($opts);
}
