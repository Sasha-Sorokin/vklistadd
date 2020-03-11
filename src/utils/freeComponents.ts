import { render, VNode } from "preact";

/**
 * Представляет собой родительский элемент, в который будет встроен фрагмент с
 * компонентом, либо функция, которой будет передан данный фрагмент для ручного
 * встраивания
 */
type InsertFunctionOrParent =
	| ((fragment: DocumentFragment) => void)
	| Element;

/**
 * Представляет собой компонент, или функцию, принимающую определённые свойства
 * и возвращающую готовый элемент
 */
type GetComponentFunctionOrComponent<PropsType> =
	| ((props: PropsType) => VNode<PropsType>)
	| VNode<PropsType>;

/**
 * Представляет собой функцию, которая отрисовывает и встраивает компонент в
 * заданный родительский элемент
 *
 * @param mountFunctionOrParent Родительский элемент или функция, которой
 * передаётся фрагмент для ручного встраивания компонента
 */
export type MountFunction<PropsType> =
	(InsertFunctionOrParent: InsertFunctionOrParent, props: PropsType) => void;

const { slice } = Array.prototype;

/**
 * @param component Компонент или функция, возвращающая компонент,
 * который необходимо отрисовать
 * @param props Свойства компонента (если требуются)
 * @returns Элемент, который необходимо отрисовать
 */
function elementToRender<PropsType>(
	component: GetComponentFunctionOrComponent<PropsType>,
	props: PropsType,
) {
	return typeof component === "function" ? component(props) : component;
}

/**
 * Встраивает фрагмент в указанный родительский элемент
 *
 * @param parent Родительский элемент или функция для самостоятельного
 * встраивания элемента
 * @param fragement Фрагмент, который необходимо встроить
 */
function insertFragement(
	parent: InsertFunctionOrParent,
	fragement: DocumentFragment,
) {
	if (typeof parent === "function") {
		parent(fragement);

		return;
	}

	parent.appendChild(fragement);
}

/**
 * Копирует ссылки на дочерние элементы фрагмента в предварительно очищенный
 * набор
 *
 * @param fragment Фрагмент, ссылки на элементы которого будут скопированы
 * @param set Набор, в который будут скопированны ссылки на элементы
 */
function cloneReferences(fragment: DocumentFragment, set: Set<Node>) {
	set.clear();

	// Array.prototype.slice — это самый надёжный способ получить массив
	// всех элементов. Array.from и другие методы ненадёжны тем, что в
	// определённых случаях неправильно сопоставляют элементы в массиве
	// ...
	// (по крайней мере, так было на момент написания этого комментария)
	const children = slice.call(fragment.childNodes) as Node[];

	for (const child of children) set.add(child);
}

/**
 * Создаёт функцию для отрисовки элемента во временный фрагмент и встраивания
 * этого фрагмента в любой элемент.
 *
 * Перед встраиванием, ссылки на отрисовываные элементы сохраняются
 * для дальнейшего использования при повторном вызове функции встраивания.
 *
 * Стоит обратить внимание, что если корневая структура компонента обновится,
 * только изменения, связанные с удалением или изменением корневых элементов,
 * будут воспроизведены в DOM дереве; остальные изменения будут воспроизведены
 * только при повторном отрисовывании (при вызове функции встраивания).
 *
 * Поэтому изменение корневой стуктуры компонента крайне не рекомендуется. Если
 * же это необходимо, лучше всего сделать корневой элемент-обёртку и назначить
 * его CSS свойство `display` как `contents`.
 *
 * @param component Компонент или функция, возвращающая компонент для отрисовки
 * @returns Функция для отрисовки и встраивания компонента в любой элемент
 */
export function asRoaming<PropsType>(
	component: GetComponentFunctionOrComponent<PropsType>,
): MountFunction<PropsType> {
	let currentNodes: Set<Node>;

	return function renderAndMount(
		insertFunctionOrParent: InsertFunctionOrParent,
		props: PropsType,
	) {
		const fragment = document.createDocumentFragment();

		if (currentNodes == null) {
			currentNodes = new Set();
		} else {
			// Для того, чтобы снова отрендерить компонент не рендеря повторно
			// уже созданные компоненты, нам нужно восстановить дерево
			// во фрагменте
			for (const node of currentNodes) fragment.appendChild(node);
		}

		render(elementToRender(component, props), fragment);

		cloneReferences(fragment, currentNodes);

		insertFragement(insertFunctionOrParent, fragment);
	};
}

/**
 * Создаёт функцию для отрисовки элемента во временный фрагмент и встраивания
 * этого фрагмента в любой элемент.
 *
 * В отличие от `asRoaming`, данная функция не сохраняет никаких ссылок и каждый
 * раз возвращает новые элементы, что позволяет бесконечность воссоздавать и
 * встраивать один и тот же компонент. В остальном они одинаковы, поэтому
 * рекомендуется изучить документацию метода `asRoaming`.
 *
 * @param component Компонент или функция, возвращающая компонент, для отрисовки
 * @returns Функция для отрисовки и встраивания компонента в любой элемент
 */
export function asReplicable<PropsType>(
	component: GetComponentFunctionOrComponent<PropsType>,
): MountFunction<PropsType> {
	return function replicateAndMount(
		insertFunctionOrParent: InsertFunctionOrParent,
		props: PropsType,
	) {
		const fragment = document.createDocumentFragment();

		render(elementToRender(component, props), fragment);

		insertFragement(insertFunctionOrParent, fragment);
	};
}
