// В этом файле хранится структура для языковых файлов
// Все строки должны объявляться в интерфейсе ILanguage

/**
 * Представляет собой переводы
 */
declare interface ITranslation {
	/**
	 * Кнопка создания нового списка
	 */
	addListButton: {
		/**
		 * Текст кнопки
		 */
		text: string;
		/**
		 * Текст подсказки
		 */
		tooltip: string;
	};

	/**
	 * Кнопка вызова бокса списков в правостороннем меню
	 */
	actionButton: {
		/**
		 * Текст кнопки
		 */
		text: string;
	};

	/**
	 * Элемент меню действий в списке групп, друзей или закладок
	 */
	actionsMenuItem: {
		/**
		 * Текст элемента меню
		 */
		text: string;
	};

	/**
	 * Надпись, призывающая к действию (добавить в список)
	 */
	actionLabel: {
		/**
		 * Шаблон текста надписи. `{}` меняется в зависимости от контекста
		 */
		template: string;

		/**
		 * Тексты для заполнителя в строке `template` в зависимости от контекста
		 */
		context: {
			/**
			 * @example "этой группы"
			 */
			group: string;

			/**
			 * @example "этого сообщества"
			 */
			public: string;

			/**
			 * @example "этого пользователя"
			 */
			profile: string;

			/**
			 * @example "для этой закладки"
			 */
			bookmark: string;

			/**
			 * @example "этой страницы"
			 */
			other: string;
		};
	};

	/**
	 * Кнопка редактирования списка
	 */
	editListButton: {
		/**
		 * Текст подсказки / альтернативный текст иконки
		 */
		text: string;

		/**
		 * Альтернативный текст для иконки
		 */
		icon: string;
	};

	/**
	 * Текст подписки
	 */
	followStatus: {
		/**
		 * Тексты в зависимости от контекста
		 */
		context: {
			/**
			 * В контексте группы
			 */
			group: [string, string];
			/**
			 * В контексте паблика
			 */
			public: [string, string];
			/**
			 * В контексте профиля
			 */
			profile: [string, string];
			/**
			 * В контексте текущего пользователя
			 */
			own: string;
		};

		/**
		 * Статус подписки неизвестен
		 */
		unknown: string;

		/**
		 * Подсказка, что подписываться не обязательно
		 */
		hint: string;
	};

	/**
	 * Сообщения для ошибок
	 */
	errorMessages: {
		/**
		 * Попытка обвернуть функцию, которая уже является обёрткой
		 */
		WRAPPING_A_WRAPPER: string;
		/**
		 * Определение языка ВКонтакте провалилось
		 */
		VK_LANGUAGE_DETECT_FAIL: string;
		/**
		 * Отсутствует или неверный контекст
		 */
		NO_OR_INVALID_CONTEXT: string;
		/**
		 * Отсутствует родительский элемент
		 */
		NO_PARENT_NODE: string;
		/**
		 * Повторная попытка установки отловщиков
		 */
		ALREADY_INJECTED: string;
	};

	/**
	 * Компонент загрузки и отображения списков
	 */
	listLoader: {
		/**
		 * Не удалось загрузить списки
		 */
		loadFailed: string;
	};

	/**
	 * Списки пользователя
	 */
	lists: {
		/**
		 * У пользователя отсутствуют списки
		 */
		empty: string;
	};

	/**
	 * Переводы для окна создания списка
	 */
	listCreation: {
		/**
		 * Подсказка к местонахождению объекта
		 */
		highlightTooltip: string;
	};

	/**
	 * Предупреждение о закрытости страницы
	 */
	privateWarning: {
		/**
		 * Текст предупреждения для пользователей
		 */
		profile: string;

		/**
		 * Текст предупреждения для групп
		 */
		group: [string, string];
	};

	/**
	 * Крайний элемент, отлавливающий ошибки
	 */
	errorBoundary: {
		/**
		 * Текст элемента при ошибке
		 */
		text: string;
	};

	/**
	 * Окно со списками
	 */
	box: {
		/**
		 * Заголовок окна со списками
		 */
		title: string;

		/**
		 * Когда нетерпеливый пользователь пытается закрыть бокс,
		 * но изменения ещё не сохранились
		 */
		savingChanges: string;

		/**
		 * Про использование Shift
		 */
		savingShift: string;
	};

	/**
	 * Статус уведомлений
	 */
	notificationsStatus: [string, string];

	/**
	 * Проверка версий
	 */
	versionChecker: {
		/**
		 * Скрипт был установлен
		 */
		installed: string;

		/**
		 * Скрипт был обновлён
		 */
		updated: string;
	};
}

declare module "*.yml" {
	namespace DoNotImport {
		const translation: ITranslation;
	}

	export = DoNotImport.translation;
}
