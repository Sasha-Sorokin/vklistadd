import { c, style } from "@utils/fashion";

export const sharedStyles = Object.freeze(
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
export const clearFix = sharedStyles.clearfix;

/**
 * Привычный отступ для элементов бокса (10px сверху/снизу, 0 по сторонам)
 */
export const { defaultMargin } = sharedStyles;

/**
 * Отключает события мыши с помощью `pointer-events: none`
 */
export const { pointerLocked } = sharedStyles;

/**
 * Устанавливает полу-прозрачность с помощью `opacity: .6`
 */
export const { disabled } = sharedStyles;

/**
 * Комбинация классов для полу-прозрачности и отключения событий мыши
 */
export const lockCombo = c(disabled, pointerLocked);

/**
 * Класс для блока ошибки, убирающий пробелы между строками
 */
export const errorMultiple = sharedStyles.errorMultiline;

/**
 * Устанавливает `margin: 0;`
 */
export const { marginReset } = sharedStyles;

/**
 * Комбинация классов для сброса отступов и пробелов между строками
 */
export const errorFixes = c(marginReset, errorMultiple);
