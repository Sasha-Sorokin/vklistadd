import { getWindow } from "@utils/window";
import { toClassName } from "@utils/fashion";

/**
 * Представляет собой хранилище состояния анимаций
 */
interface IAnimationStore {
	/**
	 * Последний установленный таймер
	 */
	timeout?: number;

	/**
	 * Последняя запущенная анимация
	 */
	animation?: VK.IAnimation;
}

const ANIMATION_STORES = new WeakMap<HTMLDivElement, IAnimationStore>();

const ANIMATION_TIMINGS = {
	fadeIn: 200,
	fadeOut: 1500,
	still: 500,
} as const;

/**
 * Представляет собой цвет надписи
 */
export const enum LabelColor {
	/**
	 * Надпись будет окрашена в красный
	 *
	 * Следует использовать для ошибок.
	 */
	Red = "red",

	/**
	 * Надпись будет окрашена в серый
	 *
	 * Следует использовать для обычных подсказок.
	 */
	Gray = "gray",

	/**
	 * К надписи не применяется никакого цвета
	 *
	 * Использовать во всех остальных случаях.
	 */
	Black = "black",
}

const COLOR = {
	red: toClassName("colorRed", { color: "#bd3232" }),
	gray: toClassName("colorGray", { color: "#606060" }),
};

/**
 * @param node Элемент футера бокса
 * @return Хранилище состояния анимации
 */
function getAnimationStore(node: HTMLDivElement) {
	let store = ANIMATION_STORES.get(node);

	if (store == null) {
		store = {};

		ANIMATION_STORES.set(node, store);
	}

	return store;
}

/**
 * Отображает сообщение в боксе
 *
 * @param box Бокс, в котором нужно отобразить сообщение
 * @param text Текст сообщения
 * @param color Цвет текста
 */
export function showControlsLabel(
	box: VK.MessageBox,
	text: string,
	color: LabelColor = LabelColor.Black,
) {
	const { controlsTextNode } = box;

	const store = getAnimationStore(controlsTextNode);

	if (store.animation != null) store.animation.stop();
	if (store.timeout != null) clearTimeout(store.timeout);

	controlsTextNode.style.opacity = "1";
	controlsTextNode.innerText = text;

	controlsTextNode.classList.toggle(COLOR.red, color === LabelColor.Red);
	controlsTextNode.classList.toggle(COLOR.gray, color === LabelColor.Gray);

	const { fadeIn, fadeOut } = getWindow();

	store.animation = fadeIn(controlsTextNode, {
		duration: 150,
		onComplete() {
			store.animation = undefined;

			store.timeout = setTimeout(() => {
				store.timeout = undefined;

				store.animation = fadeOut(controlsTextNode, {
					duration: ANIMATION_TIMINGS.fadeOut,
					onComplete() {
						store.animation = undefined;
					},
				});
			}, ANIMATION_TIMINGS.still);
		},
	});
}
