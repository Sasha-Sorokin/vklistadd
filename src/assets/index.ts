import * as gearIcon from "./gear.svg";
import * as checkbox from "./checkbox.svg";
import * as checkboxChecked from "./checkbox_checked.svg";

/**
 * @returns Объект ресурса
 */
function makeAssetObject({ default: dataURL }: { default: string }) {
	return {
		/**
		 * @returns Возвращает исходную Data ссылку
		 */
		get dataURL() {
			return dataURL;
		},
		/**
		 * @returns Ссылка для использования в CSS файлах
		 * @example url("data:image/svg+xml,...")
		 */
		get url() {
			return `url("${dataURL.replace(/"/g, "'")}")`;
		},
	};
}

export const GearIcon = makeAssetObject(gearIcon);
export const Checkbox = makeAssetObject(checkbox);
export const CheckboxChecked = makeAssetObject(checkboxChecked);
