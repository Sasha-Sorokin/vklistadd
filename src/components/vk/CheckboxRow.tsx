import { h } from "preact";
import { toStyleCombiner } from "@utils/fashion";
import { useCallback, useRef } from "preact/hooks";
import { Checkbox, CheckboxChecked } from "@/assets";
import { LOCK_COMBO } from "@common/css";

/**
 * Представляет собой опции флажка
 */
interface ICheckboxProps {
	/**
	 * Уникальный ID флажка
	 */
	id: string;

	/**
	 * Обработчик снятия/установки флажка
	 */
	onChange?(checked: boolean): void;

	/**
	 * Текст рядом с флажком
	 */
	text: string;

	/**
	 * Флажок установлен по умолчанию
	 */
	checked?: boolean;

	/**
	 * Флажок неактивен
	 */
	disabled?: boolean;
}

const S = toStyleCombiner({
	label: { cursor: "pointer" },

	checkbox: {
		marginBottom: "10px",
		lineHeight: "15px",
		width: "max-content",
		cursor: "pointer",
		transition: ".25s ease",

		"& input[type=checkbox]+label::before": {
			display: "block",
			content: "''",
			float: "left",
			background: `${Checkbox.url} no-repeat 0`,
			margin: "0 7px 0 0",
			width: "15px",
			height: "15px",
			transition: ".1s background ease-in, .1s filter ease",
		},

		"& input[type=checkbox]:disabled+label": {
			"&, &::before": {
				cursor: "default",
				opacity: "0.5",
				filter: "alpha(opacity=50)",
			},
		},

		"& input[type=checkbox]:checked+label:before": {
			backgroundImage: CheckboxChecked.url,
		},

		["&:hover label::before,"
		+ "& input[type=checkbox]+label:hover::before,"
		+ "& input[type=checkbox]:focus+label::before"]: {
			filter: "brightness(95%)",
		},

		["&:active label:before,"
		+ "& input[type=checkbox]+label:active::before"]: {
			filter: "brightness(90%)",
		},
	},
}, {
	locked: LOCK_COMBO,
});

/**
 * @param props Свойства галочки
 * @returns Элемент галочки с текстом
 */
export function CheckboxRow(props: ICheckboxProps) {
	const { text, id, onChange } = props;

	const isChecked = props.checked ?? false;
	const isDisabled = props.disabled ?? false;
	const inputRef = useRef<HTMLInputElement>();

	const onClick = () => {
		if (isDisabled) return;

		const newValue = !isChecked;

		onChange?.(newValue);
	};

	const onLabelClick = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();

			inputRef.current?.focus();
		},
		[],
	);

	return (
		<div onClick={onClick} className={S("checkbox", "locked", isDisabled)}>
			<input
				id={id}
				className="blind_label"
				type="checkbox"
				checked={isChecked}
				disabled={isDisabled}
				ref={inputRef}
			/>
			<label
				htmlFor={id}
				className={S("label")}
				onClick={onLabelClick}
				children={text}
			/>
		</div>
	);
}
