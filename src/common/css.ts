import { c, style } from "@utils/fashion";

export const SHARED_STYLES = Object.freeze(
	style({
		clearfix: {
			"&::before, &::after": {
				content: "''",
				display: "table",
				clear: "both",
			},
		},
		disabled: {
			opacity: ".6",
		},
		pointerLocked: {
			pointerEvents: "none",
		},
		defaultMargin: {
			margin: "10px 0",
		},
		errorMultiline: {
			lineHeight: "unset",
			paddingTop: "10px",
		},
		marginReset: {
			margin: "0",
		},
	}),
);

/**
 * Обычный ничошный такой clearfix
 */
export const CLEARFIX = SHARED_STYLES.clearfix;

/**
 * Привычный отступ для элементов бокса (10px сверху/снизу, 0 по сторонам)
 */
export const DEFAULT_MARGIN = SHARED_STYLES.defaultMargin;

/**
 * Отключает события мыши с помощью `pointer-events: none`
 */
export const POINTER_LOCKED = SHARED_STYLES.pointerLocked;

/**
 * Устанавливает полу-прозрачность с помощью `opacity: .6`
 */
export const DISABLED = SHARED_STYLES.disabled;

/**
 * Комбинация классов для полу-прозрачности и отключения событий мыши
 */
export const LOCK_COMBO = c(DISABLED, POINTER_LOCKED);

/**
 * Класс для блока ошибки, убирающий пробелы между строками
 */
export const ERROR_MULTILINE = SHARED_STYLES.errorMultiline;

/**
 * Устанавливает `margin: 0;`
 */
export const MARGIN_RESET = SHARED_STYLES.marginReset;

/**
 * Комбинация классов для сброса отступов и пробелов между строками
 */
export const ERROR_FIXES = c(MARGIN_RESET, ERROR_MULTILINE);
