import { findMatchingParent } from "@utils/dom";

/**
 * Обработчики нажатий комбинаций клавиш
 */
interface IShortcutsCallbacks {
	/**
	 * Обработчик нажатия Ctrl+Enter для сохранения изменений
	 */
	onSave(e: KeyboardEvent): void;
}

/**
 * @param box Бокс, элемент которого необходимо получить
 *
 * @returns Родительский объект всего содержимого бокса
 */
function getBoxContainer(box: VK.MessageBox): HTMLDivElement | null {
	return findMatchingParent(box.bodyNode, ".popup_box_container");
}

/**
 * Добавляет обработчик для комбинаций клавиш внутри бокса
 *
 * @param box Бокс, к которому добавляется обработчик
 * @param callbacks Обработчики нажатий определённых комбинаций
 *
 * @returns Функция для удаления обработчика
 */
export function initializeShortcuts(
	box: VK.MessageBox,
	callbacks: IShortcutsCallbacks,
) {
	const handler = (e: KeyboardEvent) => {
		switch (e.key) {
			case "Enter": {
				if (!e.ctrlKey) break;

				callbacks.onSave(e);
			} break;

			default: break;
		}
	};

	const boxContainer = getBoxContainer(box);

	if (boxContainer == null) return () => { /* dummy */ };

	boxContainer.addEventListener("keyup", handler);

	return () => boxContainer.removeEventListener("keyup", handler);
}
