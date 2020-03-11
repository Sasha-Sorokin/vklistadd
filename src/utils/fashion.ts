import { default as createStyle, ISimpleStyleRules } from "simplestyle-js";
import { IHashMap } from "@common/types";
import { addUnique, isArray } from "./arrays";

/**
 * На основе объекта со стилями генерирует и встраивает CSS, возвращая объект
 * с названиями классов
 *
 * Это простой alias, чтобы не мучиться с редактированием некорректных импортов.
 * Всю работу со стилями проделывает библиотека `simplestyle-js`
 *
 * @param args Карта с базовыми названиями для классов со значением объекта
 * стилей в ВерблюжейНотации
 * @returns Карту, где уже вместо объектов стилей находятся их классы для
 * дальнейшего использования в компонентах
 */
export { default as style } from "simplestyle-js";

/**
 * Представляет собой возможные типы класса
 */
type Prop = string | number | symbol;

/**
 * Представляет собой переключатели классов
 */
type ClassNamesToggles<ClassNames extends Prop> = {
	[Classname in ClassNames]: boolean;
};

/**
 * Представляет собой название класса или readonly массив из них
 */
type Droplet<ClassNames extends Prop> = ClassNames | (readonly ClassNames[]);

/**
 * Представляет собой единичный аргумент функции `c`
 */
type Drop<ClassNames extends Prop> =
	| ClassNamesToggles<ClassNames>
	| Droplet<ClassNames>
	| boolean
	| undefined
	| null;

/**
 * Представляет собой readonly аргументы функции `c`
 */
type DropArgs<ClassNames extends Prop = Prop> =
	readonly (Drop<ClassNames>)[];

/**
 * **C**ombine. Объединяет названия классов при определённых условиях
 *
 * @param names Название или объект с классами, либо условие
 *
 * @returns Объединённое название классов для которых выполнены заданные условия
 *
 * @example
 * // Аргументы:
 * c("post", "own", post.author.id === currentUser.id); // => "post own"
 * //
 * // Объекты:
 * c("post", {
 * 	own: post.author.id === currentUser.id, // допустим false
 * 	postponed: post.publishAt != null, // допустим true
 * }); // => "post postponed"
 * //
 * // Неправильные значения игнорируются:
 * c("post", "is-draft", true, false); // => "post is-draft"
 * //
 * // Магия массивов:
 * c("post", ["no-pointer", "opacity-6"], isHidden);
 * // (isHidden = true ) => "post no-pointer opacity-6"
 * // (         = false) => "post"
 */
export function c<ClassNames extends Prop>(
	...names: DropArgs<ClassNames>
): string {
	const classNames: ClassNames[] = [];

	let prevDroplet: Droplet<ClassNames> | null = null;

	const addDroplet = (replaceDroplet: Droplet<ClassNames> | null) => {
		const droplet = prevDroplet;

		prevDroplet = replaceDroplet ?? null;

		if (droplet == null) return;

		if (Array.isArray(droplet)) {
			addUnique(classNames, ...droplet);

			return;
		}

		addUnique(classNames, droplet);
	};

	// eslint-disable-next-line no-plusplus
	for (let i = 0, l = names.length; i < l; i++) {
		const drop = names[i];

		if (drop == null) continue;

		switch (typeof drop) {
			case "boolean": {
				// ESLint почему-то сходит с ума на этой строке 🤦‍♂️
				if ((prevDroplet as string | null) == null) continue;

				if (drop) addDroplet(null);

				prevDroplet = null;

				break;
			}

			case "object": {
				if (isArray<Prop, true>(drop)) {
					addDroplet(drop);

					continue;
				}

				for (const [name, toggled] of Object.entries(drop)) {
					if (toggled as boolean) addUnique(classNames, name as Prop);
				}

				prevDroplet = null;

				break;
			}

			default: {
				addDroplet(drop);

				break;
			}
		}
	}

	addDroplet(null);

	return classNames.join(" ");
}

/**
 * Представляет собой карту
 */
type ClassNamesMap<Keys extends Prop> = { [Key in Keys]: string };

/**
 * Создаёт сопостовляющую функцию для вызова `c` на основе переданной карты
 *
 * @param map Карта, для которой необходимо создать функцию
 *
 * @returns Сопостовляющая функция, принимающая аргументы точно как `c`,
 * только вместо произвольных названий классов, принимает исключительно
 * названия свойств в карте названий классов, которые впоследствии будут
 * преобразованы в соответствующие свойствам классы и переданы функции `c` для
 * объединения.
 *
 * @example
 * ```ts
 * s(styles)("leftFloat", "clearfix");
 * // => "leftFloat_pideiddechjd clearfix_pideiddechji"
 * ```
 */
export function s<Keys extends Prop>(map: ClassNamesMap<Keys>) {
	return (...drops: DropArgs<Keys>) => {
		const reversed: Drop<Prop>[] = [];

		for (const drop of drops) {
			if (drop == null) continue;

			switch (typeof drop) {
				case "string": {
					reversed.push(map[drop]);

					break;
				}

				case "object": {
					if (isArray<Keys, true>(drop)) {
						reversed.push(
							drop.map((codename) => map[codename]),
						);

						continue;
					}

					const remapped = Object.create(null);

					for (const [name, value] of Object.entries(drop)) {
						remapped[map[name as Keys]] = value;
					}

					reversed.push(remapped);

					break;
				}

				default: {
					reversed.push(drop);

					break;
				}
			}
		}

		return c(...reversed);
	};
}

/**
 * Создаёт стили и возвращает объединитель для них
 *
 * @param styles Карта стилей, которые необходимо создать
 * @param additions Дополнительные, ранее созданные стили, для использования
 * в объединителе. При коллизии имеет меньший приоритет, чем созданные стили.
 *
 * @returns Объединитель для созданных стилей
 */
export function toStyleCombiner<
	Styles extends IHashMap<ISimpleStyleRules<Styles>>,
	Additions extends IHashMap<string> | undefined
>(
	styles: Styles,
	additions?: Additions,
) {
	return s<keyof Styles | keyof Additions>({
		...additions,
		...createStyle(styles),
	});
}

/**
 * Создаёт единственный стиль и возвращает название его название класса
 *
 * @param keyName Кодовое название для использование в основе названия класса
 * @param styles Создаваемая карта стилей
 * @returns Название класса
 */
export function toClassName(
	keyName: string,
	styles: ISimpleStyleRules<unknown>,
) {
	return createStyle({ [keyName]: styles })[keyName];
}
