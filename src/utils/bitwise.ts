/* eslint-disable no-bitwise */

/**
 * Проверяет, есть ли числовом наборе флагов определённый флаг
 *
 * @param flags Набор флагов для проверки
 * @param flag Искомый флаг
 * @return `true` если флаг присутствует в наборе, иначе `false`
 */
export function hasFlag(flags: number, flag: number) {
	return (flags & flag) === flag;
}
