import * as $gearIcon from "./gear.svg";
import * as $checkbox from "./checkbox.svg";
import * as $checkboxChecked from "./checkbox_checked.svg";
import * as $editPen from "./edit_pen.svg";
import * as $newsfeedIcon from "./newsfeed.svg";

/**
 * Представляет собой объект ассета
 */
interface IAsset {
	/**
	 * Data ссылка
	 */
	default: string;
}

/**
 * @param asset Ассет из которого нужно сделать каркас
 * @return Объект ресурса
 */
function makeAssetObject(asset: IAsset) {
	const { default: dataURL } = asset;

	return {
		/**
		 * @return Возвращает исходную Data ссылку
		 */
		get dataURL() {
			return dataURL;
		},

		/**
		 * @return Ссылка для использования в CSS файлах
		 * @example url("data:image/svg+xml,...")
		 */
		get url() {
			return `url("${dataURL.replace(/"/g, "'")}")`;
		},

		get source() {
			return decodeURI(dataURL.split(",")[1]);
		},
	};
}

export const ICON_GEAR = makeAssetObject($gearIcon);
export const ICON_CHECKBOX = makeAssetObject($checkbox);
export const ICON_CHECKBOX_CHECKED = makeAssetObject($checkboxChecked);
export const ICON_PEN = makeAssetObject($editPen);
export const ICON_NEWSFEED = makeAssetObject($newsfeedIcon);
