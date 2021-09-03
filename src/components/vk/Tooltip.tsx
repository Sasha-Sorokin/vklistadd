import { h, isValidElement, VNode, cloneElement } from "preact";
import { useCallback, useState, useEffect, useMemo } from "preact/hooks";
import { getWindow } from "@utils/window";
import { wrapFunction } from "@utils/wrappers";
import { uid } from "uid";

/**
 * Представляет собой свойства элемента, на котором можно сфокусироваться или
 * на который можно навести мышкой
 */
export interface IFocusableElementProps {
	/**
	 * Обработчик наведения мышкой
	 */
	onMouseOver?(this: void, e: MouseEvent): void;

	/**
	 * Обработчик фокусировки на элементе
	 */
	onFocus?(this: void, e: FocusEvent): void;

	/**
	 * Обработчик потери фокуса элементом
	 */
	onBlur?(this: void, e: FocusEvent): void;

	/**
	 * ID элементов, описывающих компонент
	 */
	"aria-describedby"?: string;
}

/**
 * Представляет собой свойства компонента подсказок
 */
export interface ITooltipProps<P> {
	/**
	 * Дочерний элемент, который будет клонирован и обработчики которого будут
	 * заменены на обёртки с вызовом подсказки, как и присвоен аттрибут
	 * `aria-describedby` для того, чтобы скринридеры могли прочитать подсказку
	 */
	children: VNode<IFocusableElementProps & P>;

	/**
	 * Опции для подсказки
	 */
	opts: TooltipOptions;
}

type TooltipOptions = Partial<VK.ITooltipOptions<Element>>;
type TooltipObject = VK.ITooltipObject<Element, TooltipOptions>;

const ID_RANDOMNESS_LENGTH = 5;

/**
 * @return Уникальный ID для подсказки
 */
function createTooltipId() {
	return `tooltip_${uid(ID_RANDOMNESS_LENGTH)}`;
}

/**
 * Представляет собой хук с логикой создания подсказки
 *
 * @param opts Опции подсказки
 * @return Объект с функциями управления подсказой и её ID
 */
function useTooltipPreps(opts: TooltipOptions) {
	// const childRef = useRef<Element>();

	const tooltipId = useMemo(createTooltipId, [opts]);

	const [tooltipRef] = useState<{ current?: TooltipObject }>({});

	const destroyTooltip = useCallback(() => {
		tooltipRef.current?.destroy();
	}, [tooltipRef]);

	const setTooltip = useCallback(
		(tt: TooltipObject) => {
			destroyTooltip();

			tooltipRef.current = tt;

			tt.container.setAttribute("role", "tooltip");
			tt.container.setAttribute("id", tooltipId);
		},
		[destroyTooltip, tooltipRef, tooltipId],
	);

	// Мы не убираем обработчик события init у подсказки в опциях,
	// поэтому нам нужно предусмотреть тот случай, когда обработчик
	// задан в переданных опциях, иначе мы перезапишем его и он не
	// будет работать.
	//
	// Для этого смотрим, задан ли обработчик и если так, то создаём
	// функцию, которая вызовет сначала его, а потом наш метод установки
	// подсказки. Если обработчика нет — вызываем установку напрямую.
	const tooltipOptions: TooltipOptions = useMemo(
		() => ({
			...opts,
			init:
				opts.init != null
					? (tt) => {
							opts.init?.(tt);

							setTooltip(tt);
					  }
					: setTooltip,
		}),
		[opts, setTooltip],
	);

	// Это такой хак, чтобы не реализовывать загрузку модуля подсказок вручную:
	// как только отрисовка завершится, мы тут же бросаемся отобразить подсказку
	// и мгновенно её скрыть
	// useEffect(() => {
	// 	if (childRef.current == null) return;

	// 	getWindow().showTooltip(childRef.current, tooltipOptions);
	// }, [childRef]);

	const showTooltip = useCallback(
		(e: MouseEvent) => {
			getWindow().showTooltip(e.target as Element, tooltipOptions);
		},
		[tooltipOptions],
	);

	const hideTooltip = useCallback(() => {
		tooltipRef.current?.hide();
	}, [tooltipRef]);

	// TODO: use layout effect to initialize the tooltip to show it after

	return {
		tooltipId,
		showTooltip,
		hideTooltip,
		destroyTooltip,
	};
}

const TOOLTIP_NOT_ELEMENT =
	"Tooltip element must have only one child that is valid Preact element";

/**
 * @param props Свойства элемента подсказки
 * @return Клонированный дочерний элемент с обёрнутыми обработчиками и
 */
export function Tooltip<P>(props: ITooltipProps<P>) {
	const { children, opts } = props;
	const { showTooltip, hideTooltip, destroyTooltip, tooltipId } =
		useTooltipPreps(opts);

	if (!isValidElement(children)) {
		// eslint-disable-next-line max-len
		throw new Error(TOOLTIP_NOT_ELEMENT);
	}

	useEffect(() => destroyTooltip, [destroyTooltip]);

	const {
		onMouseOver,
		onFocus,
		onBlur,
		"aria-describedby": ariaBy,
	} = children.props;

	return cloneElement(children, {
		onMouseOver:
			onMouseOver != null
				? wrapFunction(onMouseOver, showTooltip)
				: showTooltip,
		onFocus:
			onFocus != null ? wrapFunction(onFocus, showTooltip) : showTooltip,
		onBlur:
			onBlur != null ? wrapFunction(onBlur, hideTooltip) : hideTooltip,
		"aria-describedby":
			ariaBy != null ? `${ariaBy} ${tooltipId}` : tooltipId,
	} as IFocusableElementProps);
}

/**
 * Представляет собой свойства компонента подсказки
 */
export interface ITitleProps<P> {
	/**
	 * Содержимое подсказки
	 */
	text: string;

	/**
	 * Отступы подсказки относительно дочернего элемента
	 */
	shift?: VK.TooltipShift;

	/**
	 * Опции для подсказки
	 */
	opts?: TooltipOptions;

	/**
	 * Дочерний элемент, который будет клонирован и обработчики которого будут
	 * заменены на обёртки с вызовом подсказки, как и присвоен аттрибут
	 * `aria-describedby` для того, чтобы скринридеры могли прочитать подсказку
	 */
	children: VNode<IFocusableElementProps & P>;
}

/**
 * @param props Свойства компонента подсказки
 * @return Компонент подсказки
 */
export function Title<P>(props: ITitleProps<P>) {
	const { text, shift, opts, children } = props;

	// Этот код точно повторяет то, как работает showTitle.
	//
	// Если коротко: title это обычная подсказка с опцией black;
	// у функции showTitle есть несколько упрощающих аргументов.
	//
	// Чтобы не создавать каждый раз новый объект и приводить к
	// обнулению прошлого обработчика, используем useMemo
	const $opts = useMemo(
		() => ({
			text,
			black: true,
			shift,
			...opts,
		}),
		[text, shift, opts],
	);

	return <Tooltip opts={$opts}>{children}</Tooltip>;
}
