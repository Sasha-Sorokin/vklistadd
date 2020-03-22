/* eslint-disable @typescript-eslint/camelcase */
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace VK {
		/**
		 * Представляет собой конфигурацию выбранного пользователем языка
		 */
		interface ILanguageConfig {
			/**
			 * Идентификатор текущей локали
			 */
			id: number;
		}

		/**
		 * Представляет собой модуль ВКонтакте
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		interface IModule<A extends any[] = never[]> {
			/**
			 * Инициализирует текущий модуль
			 */
			init(...args: A): void;
		}

		/**
		 * Тип кнопки бокса
		 */
		const enum BoxButtonType {
			/**
			 * Первичная кнопка (например, "сохранить")
			 */
			Primary = "ok",
			/**
			 * Вторичная кнопка (например, "отмена")
			 */
			Secondary = "gray",
		}

		/**
		 * Представляет собой опции бокса
		 */
		interface IBoxOptions {
			/**
			 * Текст заголовока
			 *
			 * @default ""
			 */
			title: string;

			/**
			 * HTML код элементов в заголовке (рядом с кнопкой закрытия)
			 *
			 * @default ""
			 */
			titleControls: string;

			/**
			 * Должен ли бокс быть уничтожен сразу после закрытия
			 *
			 * @default true
			 */
			selfDestruct: boolean;

			/**
			 * Бокс имеет белую тему
			 *
			 * @default false
			 */
			white: boolean;

			/**
			 * Бокс имеет серую тему
			 *
			 * @default false
			 */
			grey: boolean;

			/**
			 * Скрывать бокс при клике на фон
			 *
			 * @default true
			 */
			hideOnBGClick: boolean;

			/**
			 * Время анимации скрытия/показа в миллисекундах
			 *
			 * @default 0
			 */
			animSpeed: number;

			/**
			 * Ширина бокса
			 *
			 * @default 450
			 */
			width: number | string;

			/**
			 * Высота бокса
			 *
			 * @default "auto"
			 */
			height: number | string;

			/**
			 * Обработчик показа бокса на экране
			 */
			onShow(): void;

			/**
			 * Обработчик попытки скрытия бокса
			 *
			 * @returns {boolean} Должен ли бокс закрыться
			 */
			onHideAttempt(): boolean;

			/**
			 * Обработчик перед закрытием бокса
			 */
			onBeforeHide(): void;

			/**
			 * Обработчик после скрытия
			 */
			onHide(): void;

			/**
			 * Обработчик очистки содержимого бокса
			 */
			onClean(): void;

			/**
			 * Обработчик уничтожения бокса
			 */
			onDestroy(): void;
		}

		type MessageBoxButtonCallback = (
			button: HTMLButtonElement,
			event: PointerEvent,
		) => void;

		abstract class MessageBox {
			/**
			 * Создаёт новый бокс
			 *
			 * @param options Изначальные настройки бокса
			 */
			constructor(options: Partial<IBoxOptions>);

			/**
			 * Обновляет настройки бокса
			 *
			 * @param options Обновлённые настройки бокса
			 */
			public abstract setOptions(
				options: Partial<IBoxOptions>,
			): MessageBox;

			/**
			 * Отображает индикатор выполнения задачи в нижней панели бокса
			 */
			public abstract showProgress(): MessageBox;

			/**
			 * Скрывает индикатор выполнения задачи в нижней панели бокса
			 */
			public abstract hideProgress(): MessageBox;

			/**
			 * Перекрывает кнопку закрытия индикатором выполнения задачи
			 */
			public abstract showCloseProgress(): void;

			/**
			 * Убирает перекрывающий кнопку закрытия индикатор выполнения задачи
			 */
			public abstract hideCloseProgress(): void;

			/**
			 * Очищает содержимое бокса и встраивает элемент на его место
			 */
			public abstract content(element: HTMLElement): void;

			/**
			 * Возвращает элемент содержимого бокса
			 */
			public abstract get bodyNode(): HTMLDivElement;

			/**
			 * Добавляет кнопку в нижнюю панель бокса
			 *
			 * @param buttonText Текст кнопки
			 * @param callback Обработчик нажатия на кнопку
			 * @param type Тип кнопки
			 * @param returnButton Следует ли вернуть элемент кнопки
			 */
			public abstract addButton<R extends boolean>(
				buttonText: string,
				callback?: MessageBoxButtonCallback,
				type?: BoxButtonType,
				returnButton?: R,
			): R extends true ? HTMLButtonElement : MessageBox;

			/**
			 * Устанавливает кнопки в нижней панели бокса {@link MessageBox}
			 *
			 * @param primaryButtonText Текст на первичной кнопке
			 * @param primaryButtonCallback
			 * Обработчик нажатия на первичную кнопку
			 * @param secondaryButtonText Текст на вторичной кнопке
			 * @param secondaryButtonCallback
			 * Обработчик нажатия на вторичную кнопку
			 */
			public abstract setButtons(
				primaryButtonText: string,
				primaryButtonCallback?: MessageBoxButtonCallback,
				secondaryButtonText?: string,
				secondaryButtonCallback?: MessageBoxButtonCallback,
			): MessageBox;

			/**
			 * Убирает все кнопки из нижней панели бокса
			 */
			public abstract removeButtons(): MessageBox;

			/**
			 * @returns Текущие кнопки в нижней панели бокса
			 */
			public abstract get btns(): {
				/**
				 * Первичные кнопки
				 */
				ok: HTMLButtonElement[];
				/**
				 * Вторичные кнопки
				 */
				cancel: HTMLButtonElement[];
			};

			/**
			 * @returns Отображается ли бокс на экране
			 */
			public abstract isVisible(): boolean;

			/**
			 * Отображает бокс на экране
			 */
			public abstract show(): MessageBox;

			/**
			 * Скрывает бокс с экрана.
			 *
			 * Если в опциях установлено `selfDestruct`, то бокс уничтожается
			 */
			public abstract hide(): MessageBox;

			/**
			 * Уничтожает бокс
			 *
			 * Уничтожение бокса **во время его отображения** на экране,
			 * оставит на экране серый фон, который невозможно будет скрыть
			 * без перезагрузки страницы (баг ВК)
			 */
			public abstract destroy(): MessageBox;

			/**
			 * @returns Элемент для текста в футере
			 */
			public abstract get controlsTextNode(): HTMLDivElement;
		}

		/**
		 * Представляет собой опции для AJAX запроса
		 */
		interface IAJAXRequestOptions {
			/**
			 * Нужно ли закэшировать ответ для этого URI
			 *
			 * @default true
			 */
			cache?: boolean;

			/**
			 * Обработчик выполнения запроса
			 *
			 * @param html HTML-код, который необходимо добавить
			 * @param js JavaScript-код, который нужно исполнить
			 */
			onDone?(html: string, js: string): void;

			/**
			 * Обработчик ошибки выполнения запроса
			 */
			onFail?(): void;
		}

		/**
		 * Представляет собой интерфейс AJAX запросов
		 */
		interface IAJAX {
			/**
			 * Отправить POST запрос
			 *
			 * @param uri Ссылка на AJAX элемент
			 * @param opts Данные запроса
			 * @param reqOpts Опции запроса
			 */
			post<T>(uri: string, opts: T, reqOpts: IAJAXRequestOptions): void;
		}

		/**
		 * Представляет собой местоположение подсказки
		 */
		const enum TooltipDirection {
			/**
			 * Подсказка появляется над элементом
			 */
			Up = "up",
			/**
			 * Подсказка появляется справа от элемента
			 */
			Right = "right",
			/**
			 * Подсказка появляется под элементом
			 */
			Down = "down",
			/**
			 * Подсказка появляется слева от элемента
			 */
			Left = "left",
			/**
			 * Расположение подсказки выбирается автоматически
			 * (начальная попытка - появление над элементом)
			 */
			Auto = "auto",
		}

		type TooltipShift =
			| (readonly [number, number])
			| (readonly [number, number, number, number?]);

		/**
		 * Представляет собой объект подсказки
		 */
		interface ITooltipObject<
			Elem extends Element,
			Options extends Partial<ITooltipOptions<Elem>>
		> {
			/**
			 * Элемент, для которого создавалась подсказка
			 */
			el: Elem;

			/**
			 * Опции, использованные при создании подсказки
			 */
			opts: Options;

			/**
			 * Отображает подсказку
			 */
			show(): void;

			/**
			 * Скрывает подсказку
			 */
			hide(): void;

			/**
			 * Уничтожает подсказку
			 */
			destroy(): void;

			/**
			 * Контейнер подсказки
			 */
			container: HTMLDivElement;

			/**
			 * Отображается ли подсказка на экране
			 */
			readonly shown: boolean;
		}

		/**
		 * Представляет собой опции для подсказок
		 */
		interface ITooltipOptions<Elem extends Element> {
			/**
			 * Центрировать подсказку относительно элемента
			 */
			center: boolean;

			/**
			 * Текст подсказки
			 */
			text: string;

			/**
			 * Расположение подсказки
			 */
			dir: TooltipDirection;

			/**
			 * Смещение подсказки относительно начальной позиции
			 */
			shift: TooltipShift;

			/**
			 * Количество пикселей относительно конечной позиции
			 * для анимации "выпадания"
			 */
			slide: number;

			/**
			 * Название класса для подсказки
			 */
			className: string;

			/**
			 * Булевое значение, регулирующее наличие тени у подсказки
			 */
			no_shadow: boolean;

			/**
			 * Булевое значение, регулирующее цвет подсказки:
			 * по умолчанию подсказки белые, однако если это значение
			 * эквивалентно `true`, подсказка будет чёрной как при вызове
			 * `showTitle`.
			 *
			 * Чёрные подсказки ВКонтакте используются для небольших
			 * пояснений (например, имя контакта в правой ленте чатов),
			 * когда как белые подсказки используются для объяснения
			 * чего-либо.
			 */
			black: boolean;

			/**
			 * Обработчик создания подсказки
			 *
			 * @param tooltip Объект подсказки
			 */
			init(tooltip: ITooltipObject<Elem, this>): void;
		}

		/**
		 * Представляет собой опции анимации
		 */
		interface IAnimationOptions {
			/**
			 * Интервал в миллисекундах за который проигрывается анимация
			 */
			duration: number;

			/**
			 * Обработчик завершения анимации
			 */
			onComplete?(): void;
		}

		/**
		 * Представляет собой анимацию
		 */
		interface IAnimation {
			/**
			 * Останавливает анимацию
			 */
			stop(): void;
		}

		/**
		 * Представляет собой опции для уведомления
		 */
		interface IDoneBoxOptions {
			/**
			 * Предотвращает скрытие кликом по самому уведомления
			 */
			preventHideByClick: boolean;

			/**
			 * Предотвращает автоматическое скрытие уведомление
			 */
			noHide: boolean;

			/**
			 * Обработчик нажатия на уведомление
			 */
			onClick(): void;

			/**
			 * Обработчик автоматического скрытия уведомления
			 */
			onHide(): void;

			/**
			 * Интервал в миллисекундах, после которого уведомление скрыто
			 *
			 * Если у пользователя включён режим доступности, умножается
			 * в пять раз (1 секунда => 5 секунд)
			 */
			timeout: number;
		}

		/**
		 * Представляет собой опции навигации
		 */
		interface INavigationOpts {
			/**
			 * Обработчик успешного перехода по ссылке
			 */
			onDone?(): void;

			/**
			 * Обработчик ошибки перехода по ссылке
			 */
			onFail?(): void;
		}

		/**
		 * Представляет собой интерфейс навигации
		 */
		interface INavigation {
			/**
			 * Переходит по ссылке внутри ВКонтакте или открывает страницу
			 * безопасного перехода по внешней ссылке
			 *
			 * @param url Ссылка для перехода
			 * @param event Событие, вызвавшее переход
			 * @param opts Опции навигации
			 */
			go(
				url: string,
				event?: Event | null,
				opts?: INavigationOpts,
			): void;
		}

		/**
		 * Представляет собой список компонента списков OList
		 *
		 * Состоит из следующих элементов:
		 * 1. ID объекта
		 * 2. Название/имя объекта
		 * 3. Ссылка на аватарку объекта
		 * 4. Ссылка на объект
		 * 5. 1 если объект выбран, иначе 0
		 */
		type OListList = [
			[number, string, string, string, 0 | 1],
		];

		/**
		 * Представляет собой хэш карту выбранных элементов в OList компоненте
		 */
		interface IOListSelections {
			[id: number]: 0 | 1;
		}

		/**
		 * Представляет собой модуль новостей
		 */
		interface IFeedModule extends IModule {
			/**
			 * Открывает окно редактирования списков
			 *
			 * @param listId ID уже существующего списка или -1 для создания
			 * нового
			 */
			editList(listId: number): void;
		}
	}

	/**
	 * Представляет собой глобальную область видимости
	 */
	// eslint-disable-next-line @typescript-eslint/interface-name-prefix
	interface Window {
		/**
		 * Конфигурация выбранного пользователем языка
		 */
		langConfig: VK.ILanguageConfig;

		/**
		 * Модуль публичных страниц
		 */
		public?: VK.IModule;

		/**
		 * Модуль групп
		 */
		Groups?: VK.IModule;

		/**
		 * Модуль списка группы
		 */
		GroupsList?: VK.IModule;

		/**
		 * Модуль страниц пользователей
		 */
		Profile?: VK.IModule;

		/**
		 * Модуль закладок
		 */
		Bookmarks?: VK.IModule;

		/**
		 * Модуль списка друзей
		 */
		Friends?: VK.IModule;

		/**
		 * Модуль новостей
		 */
		feed?: VK.IFeedModule;

		/**
		 * Класс бокса
		 */
		MessageBox: new (options?: Partial<VK.IBoxOptions>) => VK.MessageBox;

		/**
		 * Представляет собой компонент списков
		 */
		OList: new (
			container: HTMLElement,
			list: VK.OListList,
			selected: VK.IOListSelections,
			opts: unknown,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => any;

		/**
		 * Переводы ВКонтакте
		 */
		lang: {
			/**
			 * @example "Сохранить"
			 */
			"box_save": string;
			/**
			 * @example "Отменить"
			 */
			"box_cancel": string;
			/**
			 * @example "Произошла ошибка"
			 */
			"global_error_occured": string;
			/**
			 * @example "Изменения сохранены"
			 */
			"global_changes_saved": string;
		};

		/**
		 * Интерфейс AJAX запросов
		 */
		ajax: VK.IAJAX;

		/**
		 * Контекст текущего модуля
		 */
		cur?: unknown;

		/**
		 * API для навигации по страницам
		 */
		nav?: VK.INavigation;

		// Wow... Переписывать built-in'ы так здорово!
		/**
		 * Исполняет скрипт в текущем контексте
		 *
		 * @param script JavaScript код, который нужно исполнить
		 * @returns Результат исполнения скрипта
		 */
		eval(script: string): unknown;

		/**
		 * Добавляет элемент индикации процесса в другой элемент
		 *
		 * @param element Элемент, в который необходимо добавить индикатор
		 */
		showProgress(element: HTMLElement): void;

		/**
		 * Отображает тёмную подсказку сверху элемента
		 *
		 * @param element Элемент, относительно которого появляется подсказка
		 * @param text Текст подсказки
		 * @param offsets Отступы подсказки относительно элемента
		 * @param opts Дополнительные опции для подсказки
		 */
		showTitle<Elem extends Element>(
			element: Elem,
			text: string,
			offsets?: VK.TooltipShift,
			opts?: Partial<VK.ITooltipOptions<Elem>>,
		): void;

		/**
		 * Отображает крупную подсказку сверху элемента
		 *
		 * @param element Элемент, относительно которого появляется подсказка
		 * @param opts Дополнительные опции для подсказки
		 */
		showTooltip<Elem extends Element>(
			element: Elem,
			opts?: Partial<VK.ITooltipOptions<Elem>>,
		): void;

		/**
		 * Отображает уведомление на экране с заданными настройками
		 * (ранее эта функция отображала чёрный бокс посреди экрана)
		 *
		 * @param content HTML содержимое уведомления
		 * @param opts Дополнительные опции для уведомления
		 */
		showDoneBox(content: string, opts?: Partial<VK.IDoneBoxOptions>): void;

		/**
		 * Блокирует кнопку и заменяет её содержимое индикатором прогресса
		 */
		lockButton(element: HTMLButtonElement): void;

		/**
		 * Убирает блокировку кнопки индикатором прогресса
		 */
		unlockButton(element: HTMLButtonElement): void;

		/**
		 * Блокирует события мыши для элемента, добавляя в его стили
		 * `pointer-events: none`. Элемент всё ещё получит события клика,
		 * например, при использовании клавиатуры. Это следует учесть.
		 */
		disableEl(element: HTMLElement): void;

		/**
		 * Убирает блокировку событий мыши у элемента, убирая
		 * `pointer-events: none` из его стилей
		 */
		enableEl(element: HTMLElement): void;

		/**
		 * Плавно скрывает элемент с экрана
		 *
		 * @param element Элемент, к которому применяется анимация
		 * @param durationOrOptions Длительность или опции для анимации
		 * @returns Запущенная анимация скрытия
		 */
		fadeOut(
			element: HTMLElement,
			durationOrOptions: number | VK.IAnimationOptions,
		): VK.IAnimation;

		/**
		 * Плавно отображает элемент на экране
		 *
		 * @param element Элемент, к которому применяется анимация
		 * @param durationOrOptions Длительнось или опции для анимации
		 * @returns Запущенная анимация появления
		 */
		fadeIn(
			element: HTMLElement,
			durationOrOptions: number | VK.IAnimationOptions,
		): VK.IAnimation;
	}

	/**
	 * Заменяется на булевое значение, указывающее, является ли текущая
	 * сборка скрипта, публичной (продакшен) сборкой
	 */
	const __isProduction__: boolean;
}

// Экспорт чего-либо отмечает файл как модуль и TSC перестаёт на него жаловаться
export type DummyType = "dummy";
