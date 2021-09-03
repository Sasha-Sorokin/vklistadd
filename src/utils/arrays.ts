/**
 * Добавляет элемент или элементы в массив, если таковые элементы
 * ранее отсутствовали в нём, иначе не делает ничего
 *
 * @param array Массив, в который добавляются элементы
 * @param elements Элементы, добавляемые в массив
 * @return Новый размер массива
 */
export function addUnique<T>(array: T[], ...elements: T[]) {
	let length: number | undefined;

	for (const element of elements) {
		if (array.includes(element)) continue;

		length = array.push(element);
	}

	return length ?? array.length;
}

/**
 * Убирает один или несколько элементов из массива
 *
 * @param array Массив, из которого удаляются элементы
 * @param elements Удаляемые из массива элементы
 * @return Массив удалённых элементов
 */
export function removeElements<T>(array: T[], ...elements: T[]) {
	const removed: T[] = [];

	for (const element of elements) {
		const index = array.indexOf(element);

		if (index === -1) continue;

		removed.push(...array.splice(index, 1));
	}

	return removed;
}

type Array<ElementType, IsReadonly> = IsReadonly extends true
	? readonly ElementType[]
	: ElementType[];

/**
 * Проверяет, является ли объект массивом.
 *
 * Под капотом этот метод использует `Array.isArray`, разница лишь
 * только в спомогательных TypeScript типах: `ElementType` - тип
 * элементов массива и `IsReadonly` - если `true`, то при положительном
 * сравнении будет отмечен как readonly массив
 *
 * @param arg Объект, который возможно является массивом
 * @return `true` если объект является массивом
 * @example
 * ```ts
 * if (isArray<string, true>(arr)) {
 * // TypeScript теперь верит, что arr — readonly string[]
 * }
 * ```
 */
export function isArray<ElementType, IsReadonly = false>(
	arg: unknown,
): arg is Array<ElementType, IsReadonly> {
	return Array.isArray(arg);
}
