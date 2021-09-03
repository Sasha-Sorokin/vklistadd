import { ILists } from "@vk/api/lists";
import { getWindow } from "@utils/window";
import { getVKTranslation } from "@utils/i18n";
import { setButtonState, ButtonState } from "@utils/buttons";
import { log } from "@utils/debug";
import { createSwitch, valueOf } from "@utils/switch";
import { SaveCallback } from "./types";
import { showControlsLabel, LabelColor } from "./controlsLabel";
import { initializeShortcuts } from "./shortcuts";

/**
 * @param lists Сохраняемый объект списков
 * @return Сохранились ли изменения
 */
async function saveChanges(lists: ILists) {
	try {
		await lists.commitChanges();

		return true;
	} catch (err) {
		log("warn", "Failed to commit changes:", err);

		return false;
	}
}

/**
 * Инициализирует кнопки и вторичные элементы бокса
 *
 * @param box Бокс, для которого инициализируются элементы
 * @return Функции для интеграции с боксом
 */
export function initializeControls(box: VK.MessageBox) {
	const isSaving = createSwitch(false);

	let lists: ILists | undefined;

	let saveButton: HTMLButtonElement;
	let cancelButton: HTMLButtonElement;

	const { lang } = getWindow();

	const [savedText, failedText] = [
		lang.global_changes_saved,
		lang.global_error_occured,
	];

	const { box: translation } = getVKTranslation();

	const lockControls = (isSaving: boolean) => {
		setButtonState(
			saveButton,
			isSaving ? ButtonState.Progress : ButtonState.Interactive,
		);

		setButtonState(
			cancelButton,
			isSaving ? ButtonState.Disabled : ButtonState.Interactive,
		);
	};

	isSaving.onChange(lockControls);

	const saveLists = async (hideBox = true) => {
		if (lists == null || isSaving.lazyToggle(true)) return;

		const saveComplete = await saveChanges(lists);

		isSaving.toggle(false);

		if (!saveComplete) {
			showControlsLabel(box, failedText, LabelColor.Red);

			return;
		}

		if (hideBox) {
			box.hide();

			getWindow().showDoneBox(savedText, { timeout: 1000 });

			return;
		}

		showControlsLabel(box, savedText, LabelColor.Gray);
	};

	const saveHandler = async (e: MouseEvent | KeyboardEvent) => {
		await saveLists(!e.shiftKey);
	};

	// #region Манипуляция боксом

	box.setOptions({
		onHideAttempt() {
			if (valueOf(isSaving)) {
				showControlsLabel(box, translation.savingChanges);

				return false;
			}

			return true;
		},

		onBeforeHide() {
			lists?.resetChanges();
		},
	});

	saveButton = box.addButton(
		lang.box_save,
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		(_, e) => saveHandler(e),
		VK.BoxButtonType.Primary,
		true,
	);

	setButtonState(saveButton, ButtonState.Disabled);

	cancelButton = box.addButton(
		lang.box_cancel,
		undefined,
		VK.BoxButtonType.Secondary,
		true,
	);

	initializeShortcuts(box, {
		onSave: saveHandler,
	});

	// #endregion

	const setLists = ($lists: ILists | null) => {
		if ($lists != null) lists = $lists;

		setButtonState(
			saveButton,
			$lists == null ? ButtonState.Disabled : ButtonState.Interactive,
		);
	};

	const resetLists = () => setLists(null);

	const saveCallbacks = new Set<SaveCallback>();

	const onSave = (callback: SaveCallback) => {
		saveCallbacks.add(callback);

		return () => saveCallbacks.delete(callback);
	};

	isSaving.onChange((value) => {
		for (const callback of saveCallbacks) {
			try {
				callback(value);
			} catch (err) {
				log("warn", "One of the onSave callbacks has failed:", err);
			}
		}
	});

	return [setLists, resetLists, onSave] as const;
}
